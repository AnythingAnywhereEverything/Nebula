use thiserror::Error;

#[derive(Debug, Error)]
pub enum RoleServiceError {
    #[error("Is not superuser")]
    NotSuperUser,

    #[error("Unable to create shop")]
    CreateShopDenied,

}
