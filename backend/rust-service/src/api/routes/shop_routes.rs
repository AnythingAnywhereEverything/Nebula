use axum::{Router, middleware, routing::{get, post}};

use crate::{
    api::{handlers::shop_handlers::{create_shop_handler, get_assosiate_shops_handler}, middleware::user_mw}, application::state::SharedState
};

pub fn routes(state: SharedState) -> Router<SharedState> {
    Router::new()
        .route("/create", post(create_shop_handler))
        .route("/{id}", get(get_assosiate_shops_handler))
        
        .layer(middleware::from_fn_with_state(
            state.clone(),
            user_mw::validate_user,
        ))
}
