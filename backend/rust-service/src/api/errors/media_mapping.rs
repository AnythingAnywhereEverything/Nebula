use hyper::StatusCode;

use crate::{api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind}, application::service::errors::MediaServiceError};



impl From<MediaServiceError> for APIError {
    fn from(err: MediaServiceError) -> Self {
        let status = match err {
            MediaServiceError::InvalidMediaType => StatusCode::UNSUPPORTED_MEDIA_TYPE,
            MediaServiceError::SizeTooLarge => StatusCode::PAYLOAD_TOO_LARGE,
            MediaServiceError::MediaMissing => StatusCode::BAD_REQUEST,
            MediaServiceError::InternalServer => StatusCode::INTERNAL_SERVER_ERROR,
        };

        let error = APIErrorEntry::new(&err.to_string())
            .code(APIErrorCode::SystemError)
            .kind(APIErrorKind::SystemError);

        Self {
            status: status.as_u16(),
            errors: vec![error],
        }
    }
}