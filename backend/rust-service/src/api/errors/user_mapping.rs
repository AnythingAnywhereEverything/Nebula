use axum::http::StatusCode;

use crate::{
    api::error::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind},
    application::{
        service::errors::UserServiceError,
        repository::errors::UserRepoError,
    },
};

impl From<UserServiceError> for APIError {
    fn from(error: UserServiceError) -> Self {
        let (status, entry) = match error {
            UserServiceError::Validation(e) => (
                StatusCode::BAD_REQUEST,
                APIErrorEntry::new(&e.to_string())
                    .code(APIErrorCode::InvalidUsername)
                    .kind(APIErrorKind::ValidationError),
            ),

            UserServiceError::Repository(UserRepoError::UsernameAlreadyTaken(username)) => (
                StatusCode::CONFLICT,
                APIErrorEntry::new(&format!(
                    "Username {} is already taken.",
                    username
                ))
                .code(APIErrorCode::UsernameAlreadyTaken)
                .kind(APIErrorKind::UserProfileError),
            ),

            UserServiceError::Repository(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorEntry::new("Internal server error.")
                    .code(APIErrorCode::SystemError)
                    .kind(APIErrorKind::SystemError)
                    .trace_id(),
            ),
        };

        APIError::from((status, entry))
    }
}