use thiserror::Error;

use crate::{application::repository::errors::UserRepoError, domain::user::error::UsernameError};

#[derive(Debug, Error)]
pub enum UserServiceError {
    #[error(transparent)]
    Validation(#[from] UsernameError),
    #[error(transparent)]
    Repository(#[from] UserRepoError),
    #[error("No user in database yet")]
    NoUser
}

impl From<sqlx::Error> for UserServiceError {
    fn from(_: sqlx::Error) -> Self {
        UserServiceError::NoUser
    }
}