use thiserror::Error;

#[derive(Debug, Error)]
pub enum ShopError {
    #[error("Shop must be between 3 and 32 characters.")]
    InvalidLength,
}