use crate::{
    api::{APIError, APIVersion, middleware::user_mw::AuthUser, version},
    application::{repository::product_repo, service::product_service::ProductService, state::SharedState},
};
use axum::{
    Extension, Json, extract::{Multipart, Path, State}, response::IntoResponse
};

pub async fn get_shop_products (
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id)): Path<(String, i64)>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let products = product_repo::get_shop_products(&mut tx, shop_id).await?;

    Ok(Json(products))
}

#[axum::debug_handler]
pub async fn create_product_handler(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id)): Path<(String, i64)>,
    multipart: Multipart,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    ProductService::create_product(&state, shop_id, multipart).await?;

    Ok(())
}
