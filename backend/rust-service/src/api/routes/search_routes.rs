use axum::{Router, routing::get};

use crate::{api::handlers::{review_handler::{get_product_reviews_handler, query_review_replies_handler}, search_handler::{get_product_page_handler, search_product_handler, type_search_handler}}, application::state::SharedState};

pub fn routes() -> Router<SharedState> {
    Router::new()
        .route("/product", get(type_search_handler))
        .route("/product_data", get(search_product_handler))
        .route("/product/{variant_id}", get(get_product_page_handler))
        .route("/review/{product_id}", get(get_product_reviews_handler))
        .route("/review/{product_id}/review/{review_id}/replies", get(query_review_replies_handler))
}