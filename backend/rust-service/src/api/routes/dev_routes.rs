use axum::{Router, routing::{get, get_service}};

use tower_http::services::ServeDir;

use crate::{api::handlers::dev_handlers::health_handler, application::state::SharedState};

pub fn routes() -> Router<SharedState> {
    Router::new()
        .route("/ping", get(health_handler))
        .nest_service("/media", get_service(ServeDir::new("../../media")))
}

