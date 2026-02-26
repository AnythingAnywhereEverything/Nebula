pub mod user_repo;
pub mod oauth_repo;
pub mod session_repo;
pub mod errors;
pub mod address_repo;

pub type RepositoryResult<T> = Result<T, sqlx::Error>;
