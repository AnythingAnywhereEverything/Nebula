use hyper::StatusCode;

use crate::{api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind}, application::repository::errors::ShopRepoError, domain::shop::error::ShopError};

impl From<ShopRepoError> for APIError {
    fn from(err: ShopRepoError) -> Self {
        let status = StatusCode::INTERNAL_SERVER_ERROR;

        let error = APIErrorEntry::new(&err.to_string())
            .code(APIErrorCode::SystemError)
            .kind(APIErrorKind::SystemError);

        Self {
            status: status.as_u16(),
            errors: vec![error],
        }
    }
}

impl From<ShopError> for APIError {
    fn from(err: ShopError) -> Self {
        let status = match err {
            ShopError::InvalidLength => StatusCode::BAD_REQUEST,
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