use thiserror::Error;

#[derive(Debug, Error)]
pub enum PasswordServiceError {
    #[error("Current password not match")]
    CurrentPasswordNotMatch,

    #[error("Failed to hashed password")]
    FailedToHash,
    
    #[error("New Password not match")]
    NewPasswordNotMatch,
    
    #[error("Database Error")]
    DatabaseError,
}

impl From<sqlx::Error> for PasswordServiceError{
    fn from(_: sqlx::Error) -> Self {
        PasswordServiceError::DatabaseError
    }
}

impl From<argon2::password_hash::Error> for PasswordServiceError{
    fn from(_: argon2::password_hash::Error) -> Self {
        PasswordServiceError::FailedToHash
    }
}