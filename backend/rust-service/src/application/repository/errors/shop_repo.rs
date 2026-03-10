use thiserror::Error;

#[derive(Debug, Error)]
pub enum ShopRepoError {
    #[error("Failed to create shop.")]
    FailedToCreateShop,
    #[error("Failed to update shop.")]
    FailedToUpdateShop,
    #[error("Unable to save shop.")]
    UnableToSaveShop,
    #[error("Failed to delete all shops.")]
    FailedToDeleteAllShops,
    #[error("Failed to delete shop.")]
    FailedToDeleteShop,
    #[error("Failed to count shops.")]
    FailedToCount,
    #[error("Username {0} is already taken.")]
    ShopAlreadyTaken(String),
    #[error("Shop not found")]
    ShopNotFound,
    #[error("Member already in current shop")]
    MemberIsExist,
}

impl From<sqlx::Error> for ShopRepoError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => ShopRepoError::ShopNotFound,
            _ => {
                tracing::error!("Database error: {:?}", err); 
                ShopRepoError::UnableToSaveShop 
            }
        }
    }
}