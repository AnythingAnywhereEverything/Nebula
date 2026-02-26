use axum::{
    Router, middleware,
    routing::{delete, get, patch, post, put},
};

use crate::{
    api::{
        handlers::{
            session_handler::{delete_session_user_handler, get_all_session_handler},
            user_handlers::{
                add_or_update_profile_handler, add_user_address_handler, change_display_name, change_username, delete_user_address_handler, get_user_addresses_handler, get_user_handler, set_default_address_handler, update_user_address_handler
            },
        },
        middleware::user_mw,
    },
    application::state::SharedState,
};

pub fn routes(state: SharedState) -> Router<SharedState> {
    Router::new()
        .route("/{id}", get(get_user_handler))
        .route("/{id}/profile_image", patch(add_or_update_profile_handler))
        .route("/{id}/display_name", patch(change_display_name))
        .route("/{id}/username", patch(change_username))

        .route("/{id}/session", get(get_all_session_handler))
        .route("/{id}/session", delete(delete_session_user_handler))

        .route("/{id}/addresses", get(get_user_addresses_handler))
        .route("/{id}/addresses", post(add_user_address_handler))
        .route("/{id}/addresses/{address_id}",put(update_user_address_handler))
        .route("/{id}/addresses/{address_id}/default",patch(set_default_address_handler),)
        .route("/{id}/addresses/{address_id}",delete(delete_user_address_handler))

        .layer(middleware::from_fn_with_state(
            state.clone(),
            user_mw::validate_user,
        ))
}
