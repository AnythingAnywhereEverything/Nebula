use axum::http::StatusCode;

use crate::{
    api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind},
    application::service::errors::EmailServiceError,
};

impl From<EmailServiceError> for APIError {
    fn from(error: EmailServiceError) -> Self {
        let (status, entry) = match error {
            EmailServiceError::Redis => (
                StatusCode::UNAUTHORIZED,
                APIErrorEntry::new("Unauthorized.")
                    .code(APIErrorCode::AuthenticationMissingCredentials)
                    .kind(APIErrorKind::AuthenticationError),
            ),
            EmailServiceError::EmailError(e) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorEntry::new(&e.to_string())
                    .code(APIErrorCode::AuthenticationMissingCredentials)
                    .kind(APIErrorKind::AuthenticationError),
            ),
            EmailServiceError::InvalidOrExpired => (
                StatusCode::GONE,
                APIErrorEntry::new("Invalid or expired token.")
                    .code(APIErrorCode::AuthenticationMissingCredentials)
                    .kind(APIErrorKind::AuthenticationError),
            )
        };
        APIError::from((status, entry))
    }
}
