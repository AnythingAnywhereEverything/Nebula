pub mod user_repo;
pub mod oauth_repo;
pub mod session_repo;
pub mod errors;

pub type RepositoryResult<T> = Result<T, sqlx::Error>;
