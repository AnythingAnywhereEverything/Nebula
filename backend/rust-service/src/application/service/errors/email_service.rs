use deadpool_redis::PoolError;
use thiserror::Error;

use crate::domain::user::error::EmailError;

#[derive(Debug, Error)]
pub enum EmailServiceError{
    #[error(transparent)]
    EmailError(#[from] EmailError),

    #[error("Invalid or expired token.")]
    InvalidOrExpired,

    #[error("Redis error.")]
    Redis,
}


impl From<PoolError>
    for EmailServiceError
{
    fn from(_: PoolError) -> Self {
        EmailServiceError::Redis
    }
}

impl From<redis::RedisError> for EmailServiceError {
    fn from(_: redis::RedisError) -> Self {
        EmailServiceError::Redis
    }
}