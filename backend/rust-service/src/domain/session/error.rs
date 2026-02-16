use thiserror::Error;

#[derive(Debug, Error)]
pub enum SessionError {
    #[error("session creation error")]
    SessionCreationError,
    #[error("Invalid session.")]
    InvalidSession,
}