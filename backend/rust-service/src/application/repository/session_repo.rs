use chrono::{TimeZone, Utc};
use redis::AsyncCommands;
use sqlx::{PgPool, Postgres, Transaction};

use crate::application::security::{argon, auth::AuthToken, session::{self, SessionError}};

async fn hash_session_token(
    session_token: &str,
) -> Result<String, sqlx::Error> {
    argon::hash(session_token.as_bytes()).map_err(|e| sqlx::Error::Protocol(e.to_string()))
}

pub async fn save_session(
    tx: &mut Transaction<'_, Postgres>,
    redis: &deadpool_redis::Pool,
    id: i64,
    user_id: i64,
    session_token: AuthToken,
    user_agent: &str,
    ip_address: &str,
    ttl_seconds: u64,
) -> Result<(), SessionError> {

    let session_hashed = hash_session_token(&session_token.package).await?;

    //turn timestamp from session_token.created_time to datetime
    let created_at = Utc.timestamp_opt(session_token.created_time, 0).unwrap().naive_utc();

    sqlx::query(
        r#"
        INSERT INTO sessions (id, user_id, token, agent, ip_address, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#
    )
    .bind(id)
    .bind(user_id)
    .bind(session_hashed)
    .bind(user_agent)
    .bind(ip_address)
    .bind(created_at)
    .execute(tx.as_mut())
    .await?;

    let mut conn = redis.get().await?;
    let key = format!("session_active:{}:{}", user_id, session_token.created_time);

    tracing::info!("Setting session key in Redis: {}", key);

    let _ : () = conn.set_ex(key, "1", ttl_seconds).await?;

    Ok(())
}

pub async fn delete_all_sessions_by_user_id(
    tx: &mut Transaction<'_, Postgres>,
    redis: &deadpool_redis::Pool,
    user_id: i64,
) -> Result<(), SessionError> {

    sqlx::query(
        r#"
        DELETE FROM sessions
        WHERE user_id = $1
        "#
    )
    .bind(user_id)
    .execute(tx.as_mut())
    .await?;

    let mut conn = redis.get().await?;
    let pattern = format!("session_active:{}:*", user_id);
    let mut cursor: u64 = 0;

    loop {
        let (next_cursor, keys): (u64, Vec<String>) =
            redis::cmd("SCAN")
                .arg(cursor)
                .arg("MATCH")
                .arg(&pattern)
                .arg("COUNT")
                .arg(100) // batch size
                .query_async(&mut conn)
                .await?;

        if !keys.is_empty() {
            let _: () = conn.del(keys).await?;
        }

        if next_cursor == 0 {
            break;
        }

        cursor = next_cursor;
    }

    Ok(())
}

pub async fn delete_session_by_token(
    tx: &mut Transaction<'_, Postgres>,
    redis: &deadpool_redis::Pool,
    session_token: &str,
) -> Result<(), SessionError> {
    let token_parsed = session::parse(session_token)
        .map_err(|e| sqlx::Error::Protocol(e.to_string()))?;

    sqlx::query(
        r#"
        DELETE FROM sessions
        WHERE user_id = $1 AND created_at = $2
        "#,
    )
    .bind(token_parsed.user_id)
    .bind(token_parsed.created_time)
    .execute(tx.as_mut())
    .await?;

    let mut conn = redis.get().await?;
    let key = format!("session_active:{}:{}", token_parsed.user_id, token_parsed.created_time);
    let _ : () = conn.del(key).await?;

    Ok(())
}

#[tracing::instrument(
    name = "Validate session token",
    skip(pool, redis),
    fields(user_id = user_id, created_time = created_time)
)]
pub async fn validate_session(
    pool: &PgPool,
    redis: &deadpool_redis::Pool,
    user_id: i64,
    created_time: i64,
    ttl_seconds: i64
) -> Result<(), SessionError> {

    let mut conn = redis.get().await?;
    let key = format!("session_active:{}:{}", user_id, created_time);
    tracing::info!("Session key {}", key);
    let exists: bool = conn.exists(key).await?;
    tracing::info!("Session exists in Redis: {}", exists);

    if exists {
        extend_session(redis, user_id, created_time, ttl_seconds).await?;
        return Ok(());
    }

    let session_exists: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT id
        FROM sessions
        WHERE user_id = $1 AND created_at = $2
        "#,
    )
    .bind(user_id)
    .bind(created_time)
    .fetch_optional(pool)
    .await?;

    if session_exists.is_none() {
        return Err(SessionError::MissingCredentials);
    }

    //recreate the redis key
    let key = format!("session_active:{}:{}", user_id, created_time);
    let _ : () = conn.set_ex(key, "1", ttl_seconds as u64).await?;

    Ok(())
}

pub async fn extend_session(
    redis: &deadpool_redis::Pool,
    user_id: i64,
    created_time: i64,
    ttl_seconds: i64,
) -> Result<(), SessionError> {
    let mut conn = redis.get().await?;

    let key = format!("session_active:{}:{}", user_id, created_time);

    let _ : () = conn.expire(key, ttl_seconds).await?;

    Ok(())
}