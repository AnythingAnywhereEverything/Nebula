use axum::{Router, middleware, routing::{get, patch, post, put}};

use crate::{
    api::{handlers::shop_handlers::{create_shop_handler, get_assosiate_shops_handler, get_current_shop_handler, update_shop_banner_handler, update_shop_info_handler, update_shop_profile_handler}, middleware::user_mw}, application::state::SharedState
};

pub fn routes(state: SharedState) -> Router<SharedState> {
    Router::new()
        .route("/create", post(create_shop_handler))
        .route("/{id}", get(get_assosiate_shops_handler))
        .route("/{id}/info", get(get_current_shop_handler))
        .route("/{id}/profile", patch(update_shop_profile_handler))
        .route("/{id}/banner", patch(update_shop_banner_handler))
        .route("/{id}/info", put(update_shop_info_handler))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            user_mw::validate_user,
        ))
}
