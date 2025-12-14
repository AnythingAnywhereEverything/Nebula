use axum::{Router, routing::get};

use crate::{api::handlers::dev_handlers::health_handler, application::state::SharedState};

pub fn routes() -> Router<SharedState> {
    Router::new().route("/ping", get(health_handler))
}
