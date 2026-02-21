use redis::AsyncCommands;

use crate::{application::{service::errors::EmailServiceError, state::AppState}, domain::user::email::{Email, EmailToken}};



pub struct EmailService;

impl EmailService {
    pub async fn request_validate_token(
        state: &AppState,
        user_id: i64,
        expiration: u64
    ) -> Result<String, EmailServiceError> {

        let token = Email::generate_validate_token(user_id);

        let mut conn = state.redis.get().await?;
        let key = format!(
            "email_verify:{}:{}:{}",
            token.user_id,
            token.timestamp,
            token.full_token
        );

        tracing::trace!("Setting email token in Redis: {}", key);

        let _: () = conn.set_ex(key, "1", expiration).await?;

        Ok(token.full_token)
    }

    pub async fn validate_token(
        state: &AppState,
        e_token: &EmailToken,
    ) -> Result<(), EmailServiceError> {
        let mut conn = state.redis.get().await?;
        
        let key = format!(
            "email_verify:{}:{}:{}",
            e_token.user_id,
            e_token.timestamp,
            e_token.full_token
        );

        tracing::trace!("Validating email token in Redis: {}", key);

        let result: Option<String> = conn.get_del(key).await?;

        
        if result.is_none() {
            return Err(EmailServiceError::InvalidOrExpired)
        }
        Ok(())
    }
}