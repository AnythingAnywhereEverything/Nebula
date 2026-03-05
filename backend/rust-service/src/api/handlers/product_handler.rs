use crate::{
    api::{APIError, APIVersion, middleware::user_mw::AuthUser, version},
    application::{service::product_service::ProductService, state::SharedState},
};
use axum::{
    Extension,
    extract::{Multipart, Path, State},
    response::IntoResponse,
};

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
