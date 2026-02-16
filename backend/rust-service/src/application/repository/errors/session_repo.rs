use thiserror::Error;

#[derive(Debug, Error)]
pub enum SessionRepoError {
    #[error("Unable to save session.")]
    UnableToSaveSession,
    #[error("Failed to delete all session.")]
    FailedToDeleteAllSession,
    #[error("Failed to delete session.")]
    FailedToDeleteSession,
    #[error("Failed to count session.")]
    FailedToCount,
    #[error("Username {0} is already taken.")]
    UsernameAlreadyTaken(String),
}