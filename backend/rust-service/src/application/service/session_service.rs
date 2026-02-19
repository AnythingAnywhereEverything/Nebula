use chrono::{TimeZone, Utc};
use redis::AsyncTypedCommands;

use crate::{
    application::{
        repository::session_repo, security::argon, service::errors::SessionServiceError,
        state::AppState,
    },
    domain::session::session_token::SessionToken,
};

pub struct SessionService {}

impl SessionService {
    async fn hash_session_token(session_token: &str) -> Result<String, SessionServiceError> {
        argon::hash(session_token.as_bytes()).map_err(|_| SessionServiceError::UnableToHashSession)
    }

    pub async fn create_session(
        state: &AppState,
        user_id: i64,
        user_agent: &str,
        ip_address: &str,
        expiration: u64,
    ) -> Result<SessionToken, SessionServiceError> {
        let token: SessionToken = SessionToken::new(user_id)?;

        let session_hashed = Self::hash_session_token(&token.full_token).await?;
        let created_at = Utc.timestamp_opt(token.timestamp, 0).unwrap().naive_utc();

        let id = state.snowflake_generator.generate_id()?;

        let mut tx = state.db_pool.begin().await?;

        session_repo::save_session(
            &mut tx,
            id,
            user_id,
            user_agent,
            ip_address,
            session_hashed,
            created_at,
        )
        .await?;

        tx.commit().await?;

        let mut conn = state.redis.get().await?;
        let key = format!("session_active:{}:{}", user_id, token.timestamp);

        tracing::trace!("Setting session key in Redis: {}", key);

        let _: () = conn.set_ex(key, "1", expiration).await?;
        Ok(token)
    }

    pub async fn delete_all_sessions(
        state: &AppState,
        user_id: i64,
    ) -> Result<(), SessionServiceError> {
        let mut tx = state.db_pool.begin().await?;

        session_repo::delete_all_sessions_by_user_id(&mut tx, user_id).await?;

        tx.commit().await?;

        let mut conn = state.redis.get().await?;
        let pattern = format!("session_active:{}:*", user_id);
        let mut cursor: u64 = 0;

        loop {
            let (next_cursor, keys): (u64, Vec<String>) = redis::cmd("SCAN")
                .arg(cursor)
                .arg("MATCH")
                .arg(&pattern)
                .arg("COUNT")
                .arg(100) // batch size
                .query_async(&mut conn)
                .await?;

            if !keys.is_empty() {
                let _: usize = conn.del(keys).await?;
            }

            if next_cursor == 0 {
                break;
            }

            cursor = next_cursor;
        }
        Ok(())
    }

    pub async fn delete_session(state: &AppState, token: &str) -> Result<(), SessionServiceError> {
        let session_token = SessionToken::parse(token)?;
        let mut tx = state.db_pool.begin().await?;

        session_repo::delete_session_by_token(&mut tx, &session_token).await?;

        tx.commit().await?;

        let mut conn = state.redis.get().await?;
        let key = format!(
            "session_active:{}:{}",
            session_token.user_id, session_token.timestamp
        );
        let _: usize = conn.del(key).await?;

        Ok(())
    }

    pub async fn validate_session(
        state: &AppState,
        user_id: i64,
        created_time: i64,
        expiration: i64,
        expiration_extend: i64,
    ) -> Result<(), SessionServiceError> {
        let mut tx = state.db_pool.begin().await?;
        let mut conn = state.redis.get().await?;
        let key = format!("session_active:{}:{}", user_id, created_time);

        tracing::trace!("Validating session key: {}", key);

        // if key exist make cache longer as user stays
        if conn.exists(&key).await? {
            conn.expire(&key, expiration_extend).await?;
            return Ok(())
        }

        let date_time = Utc.timestamp_opt(created_time, 0).unwrap().naive_utc();

        let is_exist = session_repo::is_session_exist(
            &mut tx, 
            user_id, 
            date_time, 
            expiration)
        .await?;

        if !is_exist {
            return Err(SessionServiceError::MissingCredential)
        }

        let key = format!("session_active:{}:{}", user_id, created_time);
        let _ : () = conn.set_ex(key, "1", expiration as u64).await?;

        Ok(())
    }
}
