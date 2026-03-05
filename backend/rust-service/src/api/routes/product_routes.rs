use axum::{Router, middleware, routing::post};

use crate::{
    api::{handlers::product_handler::create_product_handler, middleware::user_mw},
    application::state::SharedState,
};

pub fn routes(state: SharedState) -> Router<SharedState> {
    Router::new()
        .route("/{id}/create", post(create_product_handler))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            user_mw::validate_user,
        ))
}
