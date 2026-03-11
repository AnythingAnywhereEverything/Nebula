use axum::{Router, middleware, routing::{delete, get, patch, post, put}};

use crate::{
    api::{handlers::{product_handler::{add_to_cart_handler, create_new_variant, create_product_handler, delete_product_handler, get_cart_handler, get_producct_info, get_product_variant_info, remove_item_from_cart_handler, selected_item_handler, set_new_quantity_handler, update_product_info, update_product_settings_handler, update_variant}, review_handler::{create_review_handler, create_review_reply_handler, react_review_handler}}, middleware::user_mw},
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
        
        .route("/cart/add", post(add_to_cart_handler))
        .route("/cart", get(get_cart_handler)) 
        .route("/cart/selected", patch(selected_item_handler))
        .route("/cart/quantity", patch(set_new_quantity_handler))
        .route("/cart", delete(remove_item_from_cart_handler))
        
        .route("/{product_id}/review", post(create_review_handler))
        .route("/{product_id}/reviews/{review_id}/reply", post(create_review_reply_handler))
        
        .route("/review/{review_id}", post(react_review_handler))

        .layer(middleware::from_fn_with_state(
            state.clone(),
            user_mw::validate_user,
        ))
}
