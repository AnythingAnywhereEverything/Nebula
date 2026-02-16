use thiserror::Error;

#[derive(Debug, Error)]
pub enum UsernameError {
    #[error("Username contains invalid characters.")]
    InvalidCharacters,
    #[error("Username cannot contain consecutive periods.")]
    ConsecutivePeriods,
    #[error("Username must be between 3 and 32 characters.")]
    InvalidLength,
}