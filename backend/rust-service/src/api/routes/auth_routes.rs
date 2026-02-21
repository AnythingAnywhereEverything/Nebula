use axum::{Router, middleware, routing::{patch, post}};

use crate::{
    api::{handlers::auth_handlers::{email_verification_request_handler, email_verify_handler, login_handler, logout_handler, oauth_login_handler, register_handler, validate_handler}, middleware::auth_mw},
    application::state::SharedState,
};

pub fn routes(state: SharedState) -> Router<SharedState> {
    Router::new()
        .route("/login", post(login_handler))
        .route("/oauth", post(oauth_login_handler))
        .route("/logout", post(logout_handler))
        .route("/register", post(register_handler))
        .route("/validate", post(validate_handler))
        .route("/email", post(email_verification_request_handler))
        .route("/email", patch(email_verify_handler))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            auth_mw::map_auth_middleware
        ))
}
