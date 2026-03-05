use hyper::StatusCode;

use crate::{
    api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind},
    application::service::errors::ProductServiceError,
};

impl From<ProductServiceError> for APIError {
    fn from(err: ProductServiceError) -> Self {
        let status = match err {
            ProductServiceError::AttributeNotAllow => StatusCode::BAD_REQUEST,
            ProductServiceError::VariantAttributeMismatch => StatusCode::BAD_REQUEST,
            ProductServiceError::VariantIndexMismatch => StatusCode::BAD_REQUEST,
            ProductServiceError::Database => StatusCode::INTERNAL_SERVER_ERROR,
            ProductServiceError::IdGenerationFailed => StatusCode::INTERNAL_SERVER_ERROR,
            ProductServiceError::UnableToExtract => StatusCode::BAD_REQUEST,
            ProductServiceError::MissingVariant => StatusCode::BAD_REQUEST,
            ProductServiceError::MediaService(_) => StatusCode::INTERNAL_SERVER_ERROR,
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
