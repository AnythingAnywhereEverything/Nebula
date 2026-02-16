use axum::extract::multipart::MultipartError;
use thiserror::Error;

use crate::application::service::errors::SnowflakeServiceError;

#[derive(Debug, Error)]
pub enum MediaServiceError {
    #[error("Invalid media type.")]
    InvalidMediaType,

    #[error("File missing.")]
    MediaMissing,

    #[error("File too large.")]
    SizeTooLarge,

    #[error("Internal system error.")]
    InternalServer,
}

impl From<MultipartError> for MediaServiceError {
    fn from(_: MultipartError) -> Self {
        MediaServiceError::InternalServer
    }
}

impl From<libvips::error::Error> for MediaServiceError {
    fn from(_: libvips::error::Error) -> Self {
        MediaServiceError::InternalServer
    }
}

impl From<std::io::Error> for MediaServiceError {
    fn from(_: std::io::Error) -> Self {
        MediaServiceError::InternalServer
    }
}

impl From<SnowflakeServiceError> for MediaServiceError {
    fn from(_: SnowflakeServiceError) -> Self {
        MediaServiceError::InternalServer
    }
}
