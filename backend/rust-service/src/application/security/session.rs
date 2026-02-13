use base64::{Engine as _, engine::general_purpose};
use chrono::Utc;
use rand::{Rng, distr::Alphanumeric};
use thiserror::Error;

use crate::{api::{APIErrorCode, APIErrorEntry, APIErrorKind}, application::security::auth::AuthToken};

#[derive(Debug)]
pub struct SessionToken {
    pub user_id: i64,
    pub timestamp: i64,
    pub randomstring: String,
    pub full_token: String,
}

#[tracing::instrument(level = tracing::Level::TRACE, name = "Session token generation", skip_all, fields(user_id=user_id))]
pub async fn new(user_id: i64) -> Result<AuthToken, SessionError> {
    let now = Utc::now();
    let timestamp_millis = now.timestamp_millis();

    let timestamp_part = timestamp_millis.to_string();
    
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

    Ok(AuthToken {
        user_id,
        created_time: timestamp_millis,
        rand_string: random_string,
        package: full_discord_like_token,
    })
}

pub fn parse(token: &str) -> Result<AuthToken, SessionError> {
    let parts: Vec<&str> = token.split('.').collect();
    if parts.len() != 3 {
        return Err(SessionError::InvalidSession);
    }

    let decoded_user_id = String::from_utf8(
        general_purpose::STANDARD_NO_PAD
            .decode(parts[0])
            .map_err(|_| SessionError::InvalidSession)?,
    )
    .map_err(|_| SessionError::InvalidSession)?;

    let decoded_timestamp = String::from_utf8(
        general_purpose::STANDARD_NO_PAD
            .decode(parts[1])
            .map_err(|_| SessionError::InvalidSession)?,
    )
    .map_err(|_| SessionError::InvalidSession)?;

    let decoded_random_string = String::from_utf8(
        general_purpose::STANDARD_NO_PAD
            .decode(parts[2])
            .map_err(|_| SessionError::InvalidSession)?,
    )
    .map_err(|_| SessionError::InvalidSession)?;

    Ok(AuthToken {
        user_id: decoded_user_id.parse::<i64>().map_err(|_| SessionError::InvalidSession)?,
        created_time: decoded_timestamp.parse::<i64>().map_err(|_| SessionError::InvalidSession)?,
        rand_string: decoded_random_string,
        package: token.to_string(),
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
    #[error("Failed to hash session token")]
    HashError(String),
    #[error("Failed to parse session token")]
    ParseError(String),
    #[error("Connection pool error: {0}")]
    PoolError(#[from] deadpool_redis::PoolError),
}

impl From<SessionError> for APIErrorEntry {
    fn from(session_error: SessionError) -> Self {
        let message = session_error.to_string();
        match session_error {
            SessionError::WrongCredentials => Self::new(&message)
                .code(APIErrorCode::AuthenticationWrongCredentials)
                .kind(APIErrorKind::AuthenticationError)
                .trace_id(),
            SessionError::MissingCredentials => Self::new(&message)
                .code(APIErrorCode::AuthenticationMissingCredentials)
                .kind(APIErrorKind::AuthenticationError)
                .trace_id(),
            SessionError::SessionCreationError => Self::new(&message)
                .code(APIErrorCode::SessionError)
                .kind(APIErrorKind::AuthenticationError)
                .trace_id(),
            SessionError::InvalidSession => Self::new(&message)
                .code(APIErrorCode::SessionError)
                .kind(APIErrorKind::AuthenticationError)
                .trace_id(),
            SessionError::Forbidden => Self::new(&message)
                .code(APIErrorCode::AuthenticationForbidden)
                .kind(APIErrorKind::AuthenticationError)
                .trace_id(),
            SessionError::RedisError(_) | SessionError::SQLxError(_) => Self::new(&message)
                .code(APIErrorCode::SessionError)
                .kind(APIErrorKind::SystemError)
                .trace_id(),
            SessionError::HashError(_) | SessionError::ParseError(_) | SessionError::PoolError(_) => Self::new(&message)
                .code(APIErrorCode::SessionError)
                .kind(APIErrorKind::SystemError)
                .trace_id(),
        }
    }
}
