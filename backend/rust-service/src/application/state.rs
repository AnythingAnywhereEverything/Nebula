use std::sync::Arc;

use tokio::sync::Mutex;

use crate::{
    application::{config::Config, service::snowflake_service::SnowflakeGenerator},
    infrastructure::database::DatabasePool,
};

pub type SharedState = Arc<AppState>;

pub struct AppState {
    pub config: Config,
    pub db_pool: DatabasePool,
    pub redis: Mutex<redis::aio::MultiplexedConnection>,
    pub snowflake_generator: SnowflakeGenerator,
}
