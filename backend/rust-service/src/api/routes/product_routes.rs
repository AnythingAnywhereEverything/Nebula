use axum::{Router, middleware, routing::{get, post}};

use crate::{
    api::{handlers::product_handler::{create_product_handler, get_shop_products}, middleware::user_mw},
    application::state::SharedState,
};

pub fn routes(state: SharedState) -> Router<SharedState> {
    Router::new()
        .route("/{id}/create", post(create_product_handler))
        .route("/{id}/", get(get_shop_products))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            user_mw::validate_user,
        ))
}
