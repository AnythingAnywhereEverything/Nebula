use chrono::{NaiveDateTime, TimeZone, Utc};
use sqlx::{Postgres, Transaction};

use crate::{
    application::repository::errors::SessionRepoError, domain::session::session_token::SessionToken,
};

pub async fn save_session(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    user_id: i64,
    user_agent: &str,
    ip_address: &str,
    session_hashed: String,
    created_at: NaiveDateTime,
) -> Result<(), SessionRepoError> {
    sqlx::query(
        r#"
        INSERT INTO sessions (id, user_id, token, agent, ip_address, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
    )
    .bind(id)
    .bind(user_id)
    .bind(session_hashed)
    .bind(user_agent)
    .bind(ip_address)
    .bind(created_at)
    .execute(tx.as_mut())
    .await
    .map_err(|_| SessionRepoError::UnableToSaveSession)?;
    Ok(())
}

pub async fn delete_all_sessions_by_user_id(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
) -> Result<(), SessionRepoError> {
    sqlx::query(
        r#"
        DELETE FROM sessions
        WHERE user_id = $1
        "#,
    )
    .bind(user_id)
    .execute(tx.as_mut())
    .await
    .map_err(|_| SessionRepoError::FailedToDeleteAllSession)?;
    Ok(())
}

pub async fn delete_session_by_token(
    tx: &mut Transaction<'_, Postgres>,
    session_token: &SessionToken,
) -> Result<(), SessionRepoError> {
    let create_time = Utc
        .timestamp_opt(session_token.timestamp, 0)
        .unwrap()
        .naive_utc();

    sqlx::query(
        r#"
        DELETE FROM sessions
        WHERE user_id = $1 AND created_at = $2
        "#,
    )
    .bind(session_token.user_id)
    .bind(create_time)
    .execute(tx.as_mut())
    .await
    .map_err(|_| SessionRepoError::FailedToDeleteSession)?;
    Ok(())
}

#[tracing::instrument(
    name = "Validate session token",
    skip(tx),
    fields(user_id = user_id)
)]
pub async fn is_session_exist(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    created_time: NaiveDateTime,
    ttl_seconds: i64,
) -> Result<bool, SessionRepoError> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM sessions
        WHERE user_id = $1 AND created_at = $2
        "#,
    )
    .bind(user_id)
    .bind(created_time)
    .fetch_one(tx.as_mut())
    .await
    .map_err(|_| SessionRepoError::FailedToCount)?;
    Ok(count > 0)
}
