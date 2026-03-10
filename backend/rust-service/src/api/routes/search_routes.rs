use axum::{Router, routing::get};

use crate::{api::handlers::search_handler::{get_product_page_handler, search_product_handler, type_search_handler}, application::state::SharedState};

pub fn routes() -> Router<SharedState> {
    Router::new()
        .route("/product", get(type_search_handler))
        .route("/product_data", get(search_product_handler))
        .route("/product/{variant_id}", get(get_product_page_handler))
}