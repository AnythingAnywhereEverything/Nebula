use axum::{
    Router, middleware, routing::{get, patch}
};

use crate::{
    api::{handlers::user_handlers::{
        add_or_update_profile_handler, change_display_name, change_username, get_user_handler
    }, middleware::user_mw},
    application::state::{SharedState},
};

pub fn routes(state: SharedState) -> Router<SharedState> {
    Router::new()
        // .route("/", get(list_users_handler))
        .route("/{id}", get(get_user_handler))
        .route("/{id}/profile_image", patch(add_or_update_profile_handler))
        .route("/{id}/display_name", patch(change_display_name))
        .route("/{id}/username", patch(change_username))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            user_mw::validate_user
        ))
    // .route("/{id}", patch(deactive_user_handler))
}
