use axum::{Router, routing::post};

use crate::{
    api::handlers::auth_handlers::{login_handler, logout_handler, oauth_register_handler, register_handler, validate_handler},
    application::state::SharedState,
};

pub fn routes() -> Router<SharedState> {
    Router::new()
        .route("/login", post(login_handler))
        .route("/oauth_register", post(oauth_register_handler))
        .route("/logout", post(logout_handler))
        .route("/register", post(register_handler))
        .route("/validate", post(validate_handler))
}
