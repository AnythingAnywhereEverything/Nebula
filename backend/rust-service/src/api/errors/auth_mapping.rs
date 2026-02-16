use axum::http::StatusCode;

use crate::{
    api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind},
    application::service::errors::AuthServiceError,
};

impl From<AuthServiceError> for APIError {
    fn from(error: AuthServiceError) -> Self {
        let (status, entry) = match error {
            e => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorEntry::new(&e.to_string())
                    .code(APIErrorCode::SystemError)
                    .kind(APIErrorKind::SystemError),
            ),
        };
        APIError::from((status, entry))
    }
}
