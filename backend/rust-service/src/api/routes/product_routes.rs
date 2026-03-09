use axum::{Router, middleware, routing::{delete, get, patch, post, put}};

use crate::{
    api::{handlers::product_handler::{create_new_variant, create_product_handler, delete_product_handler, get_producct_info, get_product_variant_info, update_product_info, update_product_settings_handler, update_variant}, middleware::user_mw},
    application::state::SharedState,
};

pub fn routes(state: SharedState) -> Router<SharedState> {
    Router::new()
        .route("/{id}/create", post(create_product_handler))
        .route("/{shop_id}/product/{product_id}/info", patch(update_product_info))
        .route("/{shop_id}/product/{product_id}/settings", patch(update_product_settings_handler))
        .route("/{shop_id}/product/{product_id}/variant", post(create_new_variant))
        
        .route("/{shop_id}/product/{product_id}", get(get_producct_info))
        .route("/{shop_id}/product/{product_id}", delete(delete_product_handler))
        .route("/{shop_id}/product/{product_id}/variant/{variant_id}", get(get_product_variant_info))
        .route("/{shop_id}/product/{product_id}/variant/{variant_id}", put(update_variant))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            user_mw::validate_user,
        ))
}
