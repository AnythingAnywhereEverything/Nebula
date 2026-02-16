use thiserror::Error;

#[derive(Debug, Error)]
pub enum UserRepoError {
    #[error("Internal server error.")]
    UserInternalServerError,
    #[error("Username {0} is already taken.")]
    UsernameAlreadyTaken(String),
}