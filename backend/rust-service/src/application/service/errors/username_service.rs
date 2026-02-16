use thiserror::Error;

use crate::{application::repository::errors::UserRepoError, domain::user::error::UsernameError};

#[derive(Debug, Error)]
pub enum UserServiceError {
    #[error(transparent)]
    Validation(#[from] UsernameError),
    #[error(transparent)]
    Repository(#[from] UserRepoError),
}
