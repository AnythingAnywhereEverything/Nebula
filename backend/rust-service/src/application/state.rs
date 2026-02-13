use std::sync::Arc;

use deadpool_redis::Pool;

use crate::{
    application::{config::Config, service::snowflake_service::SnowflakeGenerator},
    infrastructure::database::DatabasePool,
};

pub type SharedState = Arc<AppState>;


pub struct AppState {
    pub config: Config,
    pub db_pool: DatabasePool,
    pub redis: Pool,
    pub snowflake_generator: SnowflakeGenerator,
}