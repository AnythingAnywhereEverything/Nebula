use axum::{
    Extension, Json,
    extract::{Multipart, Path, State},
    response::IntoResponse,
};
use serde_json::json;

use crate::{
    api::{APIError, APIVersion, middleware::user_mw::AuthUser, version},
    application::{
        repository::{errors::ShopRepoError, product_repo, shop_repo}, service::media_service::{AllowedMediaType, ImageTransform, MediaOptions}, state::SharedState
    },
    domain::{models::shop::{AssociateShops, NewShop, Shop, ShopResponse, ShopUpdateData}, shop::shop::ShopName},
};

#[derive(serde::Deserialize)]
pub struct CreateShopRequest {
    pub name: String,
    pub description: Option<String>,
}

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

    // ? somehow error happen after remove :Vec<Shop>
    let owned:Vec<Shop> = shop_repo::get_shop_by_owner_id(&mut tx, id).await?;
    let associate:Vec<Shop> = shop_repo::get_shop_by_member_id(&mut tx, id).await?;

    let result = AssociateShops {
        owned: owned.into_iter().map(ShopResponse::from).collect(),
        associate: associate.into_iter().map(ShopResponse::from).collect(),
    };

    Ok(Json(json!(result)))
}

pub async fn get_current_shop_handler(
    State(state): State<SharedState>,
    Path((version, id)): Path<(String, i64)>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;
    let current_shop:Shop = shop_repo::get_current_shop_by_shop_id(&mut tx, id).await?;
    Ok(Json(ShopResponse::from(current_shop)))
}

pub async fn update_shop_info_handler(
    State(state): State<SharedState>,
    Path((version, id)): Path<(String, i64)>,
    Json(payload): Json<CreateShopRequest>, 
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;
    let new_info  = ShopUpdateData {
        name: payload.name,
        description: payload.description,
    };
    
    shop_repo::update_info_shop(&mut tx, id,new_info).await?;
    tx.commit().await?;
    
    Ok(())
} 

pub async fn update_shop_profile_handler(
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    multipart: Multipart,
) -> Result<impl IntoResponse, APIError> {
    
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    // !TODO: permission check
    let profile_options = MediaOptions {
        folder: "shop_profile".into(),
        max_size: 8 * 1024 * 1024,
        allowed_types: vec![AllowedMediaType::Jpeg, AllowedMediaType::Png],
        image_transform: Some(ImageTransform::Crop {
            max_width: 512,
            max_height: 512,
            ratio: Some((1, 1)),
        }),
    };
    let mut tx = state.db_pool.begin().await?;
    let shop = shop_repo::get_current_shop_by_shop_id(&mut tx
        , id).await?;

    let old_profile_path = shop.shop_profile_url;
    let image_profile_bytes = state.media_service.extract_multipart_bytes(
        multipart, 
        Some("file"), 
        8 * 1024 * 1024)
        .await?;

    let relative_profile_path = state
    .media_service
    .save_media(&image_profile_bytes[0], profile_options, old_profile_path)
    .await?;

    let profile_image_path = Shop {
        shop_profile_url: Some(relative_profile_path.clone()),
        ..Default::default()
    };

    shop_repo::update_profile_shop(&mut tx, id, profile_image_path).await?;
    tx.commit().await?;
    Ok(())
}

pub async fn update_shop_banner_handler(
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    multipart: Multipart,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    // !TODO: permission check
    let banner_options = MediaOptions {
        folder: "shop_banner".into(),
        max_size: 8 * 1024 * 1024,
        allowed_types: vec![AllowedMediaType::Jpeg, AllowedMediaType::Png],
        image_transform: Some(ImageTransform::Crop {
            max_width: 3078,
            max_height: 1024,
            ratio: Some((25, 10)), 
        }),
    };

    let mut tx = state.db_pool.begin().await?;
    let shop = shop_repo::get_current_shop_by_shop_id(&mut tx
        , id).await?;
        

    let old_banner_path = shop.shop_banner_url;
    let image_banner_bytes = state.media_service.extract_multipart_bytes(
        multipart,
        Some("file"),
        8 * 1024 * 1024)
        .await?;

    let relative_banner_path = state
    .media_service
    .save_media(&image_banner_bytes[0], banner_options, old_banner_path)
    .await?;

    let banner_image_path = Shop {
        shop_banner_url: Some(relative_banner_path.clone()),
        ..Default::default()
    };

    shop_repo::update_banner_shop(&mut tx, id,banner_image_path).await?;
    tx.commit().await?;

    Ok(())
}
