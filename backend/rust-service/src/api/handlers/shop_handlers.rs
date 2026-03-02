use axum::{
    Extension, Json,
    extract::{Path, State},
    response::IntoResponse,
};
use serde_json::json;

use crate::{
    api::{APIError, APIVersion, middleware::user_mw::AuthUser, version},
    application::{
        repository::{errors::ShopRepoError, shop_repo},
        state::SharedState,
    },
    domain::{models::shop::{AssociateShops, NewShop, ShopResponse}, shop::shop::ShopName},
};

#[derive(serde::Deserialize)]
pub struct CreateShopRequest {
    pub name: String,
    pub description: Option<String>,
}

pub async fn create_shop_handler(
    Extension(auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path(version): Path<String>,
    Json(payload): Json<CreateShopRequest>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let shop = ShopName::new(payload.name)?;
    let user_id = auth.user_id;

    let new_shop_id = state.snowflake_generator.generate_id()?;

    // check if similar shop exist
    let mut tx = state.db_pool.begin().await?;
    if shop_repo::is_shop_exist(&mut tx, shop.as_str().to_string()).await? {
        return Err(ShopRepoError::ShopAlreadyTaken(shop.as_str().to_string()).into());
    }

    let new_shop = NewShop {
        id: new_shop_id,
        name: shop.into_inner(),
        description: payload.description,
        is_brand: false,
        owner_id: user_id,
    };

    shop_repo::create_shop(&mut tx, new_shop).await?;

    tx.commit().await?;

    Ok(())
}

pub async fn get_assosiate_shops_handler(
    // Extension(auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, id)): Path<(String, i64)>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let owned = shop_repo::get_shop_by_owner_id(&mut tx, id).await?;
    let associate = shop_repo::get_shop_by_member_id(&mut tx, id).await?;

    let result = AssociateShops {
        owned: owned.into_iter().map(ShopResponse::from).collect(),
        associate: associate.into_iter().map(ShopResponse::from).collect(),
    };

    Ok(Json(json!(result)))
}