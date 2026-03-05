use axum::extract::multipart::MultipartError;
use thiserror::Error;

use crate::application::service::errors::{MediaServiceError, SnowflakeServiceError};

#[derive(Debug, Error)]
pub enum ProductServiceError {
    #[error("Unable to extract payload")]
    UnableToExtract,

    #[error("Wrong attribute?")]
    AttributeNotAllow,

    #[error("Product must have at least 1 variant")]
    MissingVariant,

    #[error("Variant attribute incorrect")]
    VariantAttributeMismatch,

    #[error("Variant index mismatch")]
    VariantIndexMismatch,

    #[error("Failed to generate id for product")]
    IdGenerationFailed,

    #[error("Database error.")]
    Database,

    #[error(transparent)]
    MediaService(#[from] MediaServiceError)
}

impl From<SnowflakeServiceError> for ProductServiceError {
    fn from(_: SnowflakeServiceError) -> Self {
        ProductServiceError::IdGenerationFailed
    }
}

impl From<sqlx::Error> for ProductServiceError {
    fn from(_: sqlx::Error) -> Self {
        ProductServiceError::Database
    }
}

impl From<MultipartError> for ProductServiceError {
    fn from(_: MultipartError) -> Self {
        ProductServiceError::UnableToExtract
    }
}
