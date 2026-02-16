mod error;
mod extractors;
mod routes;
mod version;

pub mod handlers;
pub mod server;
pub mod middleware;

pub use error::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind};
pub use version::APIVersion;

pub mod errors;
