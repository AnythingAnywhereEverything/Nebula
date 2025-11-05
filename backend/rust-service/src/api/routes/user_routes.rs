use axum::{
    Router,
    routing::{delete, get, patch, put},
};

use crate::{
    api::handlers::user_handlers::{
        deactive_user_handler, delete_user_handler, get_user_handler, list_users_handler,
        update_user_handler,
    },
    application::state::SharedState,
};

pub fn routes() -> Router<SharedState> {
    Router::new()
        .route("/", get(list_users_handler))
        .route("/{id}", get(get_user_handler))
        .route("/{id}", put(update_user_handler))
        .route("/{id}", patch(deactive_user_handler))
        .route("/{id}", delete(delete_user_handler))
}
