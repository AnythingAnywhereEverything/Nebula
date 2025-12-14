use std::sync::Arc;

use tokio::sync::Mutex;

use crate::{
    api::server,
    application::{config, service::snowflake_service::SnowflakeGenerator, state::AppState},
    infrastructure::{database::Database, redis},
};

pub async fn run() {
    tracing::info!("loading configuration and initializing services...");
    // Load configuration.
    let config = config::load();
    // Connect to Redis.
    let redis = redis::open(&config).await;
    // Connect to PostgreSQL.
    let db_pool = Database::connect(config.clone().into())
        .await
        .expect("Failed to connect to the database.");
    // Run migrations.
    Database::migrate(&db_pool)
        .await
        .expect("Failed to run database migrations.");
    // Initialize snowflake generator.
    let snowflake_generator = SnowflakeGenerator::new(config.server_worker_id)
        .expect("Failed to create snowflake generator.");
    // Build the application state.
    let shared_state = Arc::new(AppState {
        config,
        db_pool,
        redis: Mutex::new(redis),
        snowflake_generator,
    });
    server::start(shared_state).await;
}
