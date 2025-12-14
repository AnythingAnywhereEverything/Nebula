use std::sync::Arc;

use tokio::sync::Mutex;

use crate::{
    api::server,
    application::{config, service::snowflake_service::SnowflakeGenerator, state::AppState},
    infrastructure::{database::Database, redis},
};

pub async fn run() {
    // print loading
    tracing::info!("loading configuration and initializing services...");
    println!("loading configuration and initializing services...");
    // Load configuration.

    let config = config::load();
    println!("Configuration loaded.");
    // Connect to Redis.
    let redis = redis::open(&config).await;
    println!("Connected to Redis.");
    // Connect to PostgreSQL.
    let db_pool = Database::connect(config.clone().into())
        .await
        .expect("Failed to connect to the database.");
    println!("Connected to PostgreSQL.");
    // Run migrations.
    Database::migrate(&db_pool)
        .await
        .expect("Failed to run database migrations.");
    println!("Database migrations completed.");
    // Initialize snowflake generator.
    let snowflake_generator = SnowflakeGenerator::new(config.server_worker_id)
        .expect("Failed to create snowflake generator.");
    println!("Snowflake generator initialized.");
    // Build the application state.
    let shared_state = Arc::new(AppState {
        config,
        db_pool,
        redis: Mutex::new(redis),
        snowflake_generator,
    });
    println!("Starting the server...");
    server::start(shared_state).await;
}
