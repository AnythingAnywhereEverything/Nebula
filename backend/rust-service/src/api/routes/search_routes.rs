use axum::{Router, routing::get};

use crate::{api::handlers::search_handler::type_search_handler, application::state::SharedState};

pub fn routes() -> Router<SharedState> {
    Router::new()
        .route("/product", get(type_search_handler))
}