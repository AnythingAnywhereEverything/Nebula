use base64::{Engine as _, engine::general_purpose};
use chrono::{Timelike, Utc};
use rand::{Rng, distr::Alphanumeric};
use thiserror::Error;

#[derive(Debug)]
pub struct SessionToken {
    pub user_id: String,
    pub timestamp: String,
    pub randomstring: String,
    pub full_token: String,
}

pub async fn new(user_id: i64) -> Result<SessionToken, SessionError> {
    let now = Utc::now();
    let timestamp_millis = now.timestamp_millis();

    let timestamp_part = format!("{}.{}", timestamp_millis, now.nanosecond());

    let random_string_length = 32;
    let random_string: String = rand::rng()
        .sample_iter(&Alphanumeric)
        .take(random_string_length)
        .map(char::from)
        .collect();

    if random_string.is_empty() {
        return Err(SessionError::SessionCreationError);
    }

    let encoded_user_id = general_purpose::STANDARD_NO_PAD.encode(user_id.to_string());
    let encoded_timestamp_part = general_purpose::STANDARD_NO_PAD.encode(&timestamp_part);
    let encoded_random_string = general_purpose::STANDARD_NO_PAD.encode(&random_string);

    let full_discord_like_token = format!(
        "{}.{}.{}",
        encoded_user_id, encoded_timestamp_part, encoded_random_string
    );

    Ok(SessionToken {
        user_id: user_id.to_string(),
        timestamp: timestamp_part,
        randomstring: random_string,
        full_token: full_discord_like_token,
    })
}

#[derive(Debug, Error)]
pub enum SessionError {
    #[error("wrong credentials")]
    WrongCredentials,
    #[error("missing credentials")]
    MissingCredentials,
    #[error("session creation error")]
    SessionCreationError,
    #[error("invalid session")]
    InvalidSession,
    #[error("forbidden")]
    Forbidden,
    #[error(transparent)]
    RedisError(#[from] redis::RedisError),
    #[error(transparent)]
    SQLxError(#[from] sqlx::Error),
}
