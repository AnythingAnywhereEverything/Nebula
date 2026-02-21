use thiserror::Error;

use crate::domain::session::error::TokenError;

#[derive(Debug, Error)]
pub enum UsernameError {
    #[error("Username contains invalid characters.")]
    InvalidCharacters,
    #[error("Username cannot contain consecutive periods.")]
    ConsecutivePeriods,
    #[error("Username must be between 3 and 32 characters.")]
    InvalidLength,
}

#[derive(Debug, Error)]
pub enum EmailError {
    #[error("Invalid email format.")]
    InvalidEmailFormat,
    #[error("Invalid token.")]
    InvalidToken
}

impl From<TokenError> for EmailError {
    fn from(_: TokenError) -> Self {
        Self::InvalidToken
    }
}