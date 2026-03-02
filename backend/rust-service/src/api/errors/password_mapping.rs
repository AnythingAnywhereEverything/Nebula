use axum::http::StatusCode;

use crate::{api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind}, application::service::errors::PasswordServiceError};

impl From<PasswordServiceError> for APIError{
    fn from(error: PasswordServiceError ) -> Self {
        let (status, entry) = match error {
            PasswordServiceError::CurrentPasswordNotMatch => (
                StatusCode::CONFLICT,
                APIErrorEntry::new("Current password not match.")
                    .code(APIErrorCode::PasswordError)
                    .kind(APIErrorKind::PasswordError)
            ),
            e => (
                StatusCode::NOT_ACCEPTABLE,
                APIErrorEntry::new( &e.to_string())
                    .code(APIErrorCode::PasswordError)
                    .kind(APIErrorKind::PasswordError)
            )
        };
        APIError::from((status, entry))
    }
}