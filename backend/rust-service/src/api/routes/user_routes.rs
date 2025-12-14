use axum::{Router, routing::get};

use crate::{api::handlers::user_handlers::get_user_handler, application::state::SharedState};

pub fn routes() -> Router<SharedState> {
    Router::new()
        // .route("/", get(list_users_handler))
        .route("/{id}", get(get_user_handler))
    // .route("/{id}", put(update_user_handler))
    // .route("/{id}", patch(deactive_user_handler))
}
