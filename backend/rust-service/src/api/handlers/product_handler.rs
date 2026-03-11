use std::{collections::{HashMap, HashSet}};

use crate::{
    api::{APIError, APIVersion, middleware::user_mw::AuthUser, version},
    application::{repository::{cart_repo, product_repo}, service::{errors::{MediaServiceError, ProductServiceError}, media_service::{AllowedMediaType, ImageTransform, MediaOptions, MediaService}, product_service::ProductService}, state::SharedState}, domain::models::{cart::CheckMarkToCart, product::{AddToCartProduct, CreateNewVariantDto, ProductImages, UpdateProductInfoDto, UpdateProductSettings, UpdateVariantDto}},
};
use axum::{
    Extension, Json, extract::{Multipart, Path, State}, response::IntoResponse
};

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

pub async fn update_product_settings_handler(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id, product_id)): Path<(String, i64, i64)>,
    Json(payload): Json<UpdateProductSettings>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    let mut tx = state.db_pool.begin().await?;

    product_repo::update_product_settings(
        &mut tx, 
        product_id, 
        shop_id,
        payload.active,
        payload.free_shipping
    ).await?;
    
    tx.commit().await?;

    Ok(())
}


pub async fn delete_product_handler(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id, product_id)): Path<(String, i64, i64)>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    let mut tx = state.db_pool.begin().await?;

    product_repo::delete_product(&mut tx, product_id, shop_id).await?;
    
    tx.commit().await?;

    Ok(())
}


pub async fn update_variant(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id, product_id, variant_id)): Path<(String, i64, i64, i64)>,
    multipart: Multipart,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    const MAX_IMAGE_SIZE: usize = 8 * 1024 * 1024;

    let data = 
        MediaService::extract_payload_with_type::<UpdateVariantDto>
        (multipart, MAX_IMAGE_SIZE).await?;
    let payload = data.payload;

    let mut tx = state.db_pool.begin().await?;

    let old_images: Vec<ProductImages> = product_repo::get_variant_images(&mut tx, variant_id).await?;

    let old_map: HashMap<i64, &ProductImages> =
        old_images.iter().map(|img| (img.id, img)).collect();

    let mut seen_ids = HashSet::new();
    let mut delete_ids = Vec::new();
    let mut update_positions = Vec::new();
    let mut create_images = Vec::new();

    let mut file_index = 0;

    for (position, img) in payload.images.iter().enumerate() {
        let pos = position as i32;

        match img.id {
            Some(id) => {
                let _old = old_map.get(&id)
                    .ok_or(MediaServiceError::InternalServer)?;

                // ! prevent duplicate ids in payload
                if !seen_ids.insert(id) {
                    return Err(MediaServiceError::InternalServer.into());
                }

                update_positions.push((id, pos));
            }

            None => {
                // * new image -> consume file
                if file_index >= data.files.len() {
                    return Err(MediaServiceError::MediaMissing.into());
                }

                let file = &data.files[file_index];
                file_index += 1;

                create_images.push((file, pos));
            }
        }
    }

    for old in &old_images {
        if !seen_ids.contains(&old.id) {
            delete_ids.push(old.id);
        }
    }

    // * perform checkl first

    product_repo::update_product_variant(
        &mut tx,
        variant_id,
        product_id,
        shop_id,
        &payload.sku,
        &payload.price,
        payload.sale_price.as_ref(),
        &payload.cost,
        payload.on_sale,
        payload.stock,
        payload.barcode.as_deref()
    ).await?;

    for id in delete_ids {
        let img = old_map.get(&id).unwrap();

        state.media_service.delete_old_file(&img.image_url).await;

        product_repo::delete_product_image(&mut tx, id).await?;
    }

    product_repo::offset_variant_image_position(&mut tx, variant_id, 1000).await?;

    for (id, pos) in update_positions {
        product_repo::update_product_image_position(&mut tx, id, pos).await?;
    }

        for (file, pos) in create_images {
        let options = MediaOptions {
            folder: "products".into(),
            max_size: MAX_IMAGE_SIZE,
            allowed_types: vec![
                AllowedMediaType::Jpeg,
                AllowedMediaType::Png,
            ],
            image_transform: Some(ImageTransform::Resize {
                max_width: 1200,
                max_height: 1200,
            }),
        };

        let url: String = state.media_service.save_media(file, options, None).await?;

        product_repo::insert_variant_image_position(&mut tx, &state, variant_id, url, pos).await?;
    }

    tx.commit().await?;

    Ok(())
}


pub async fn create_new_variant(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id, product_id)): Path<(String, i64, i64)>,
    multipart: Multipart,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    const MAX_IMAGE_SIZE: usize = 8 * 1024 * 1024;
    
    let data = 
        MediaService::extract_payload_with_type::<CreateNewVariantDto>
        (multipart, MAX_IMAGE_SIZE).await?;

    let payload = data.payload;

    let mut tx = state.db_pool.begin().await?;

    // validate options
    let count = product_repo::validate_attribute_options_belong_to_product(&mut tx, product_id, &payload.attribute_options).await?;
    if count != payload.attribute_options.len() as i64 {
        return Err(ProductServiceError::AttributeNotAllow.into());
    }

    // check duplicate attribute usage
    if product_repo::duplicate_attribute_in_options(&mut tx, &payload.attribute_options).await? {
        return Err(ProductServiceError::AttributeNotAllow.into());
    }

    // check variant combination
    if product_repo::variant_combination_exists(&mut tx, product_id, &payload.attribute_options).await? {
        return Err(ProductServiceError::VariantAttributeMismatch.into());
    }

    // insert variant
    let variant_id = state.snowflake_generator.generate_id()?;
    product_repo::insert_product_variant(
        &mut tx,
        variant_id,
        shop_id,
        product_id,
        &payload.sku,
        &payload.price,
        payload.sale_price.as_ref(),
        &payload.cost,
        payload.on_sale,
        payload.stock,
        payload.barcode.as_deref(),
    ).await?;

    // insert links
    for opt in &payload.attribute_options {
        product_repo::insert_variant_attribute_value(&mut tx, variant_id, *opt).await?;
    }

    // * prepare images

    let mut paths: Vec<String> = Vec::new();
    let mut image_uploads: HashMap<i64, Vec<String>> = HashMap::new();

    for image in data.files {
        // * save images
        let options = MediaOptions {
            folder: "products/variants".into(),
            max_size: MAX_IMAGE_SIZE,
            allowed_types: vec![
                AllowedMediaType::Jpeg,
                AllowedMediaType::Png,
            ],
            image_transform: Some(ImageTransform::Resize {
                max_width: 1200,
                max_height: 1200,
            }),
        };
        let url = state.media_service.save_media(&image, options, None).await?;
        
        paths.push(url);
    }
    image_uploads.insert(*&variant_id, paths);

    product_repo::insert_variant_images(&mut tx, &state, &image_uploads).await?;

    tx.commit().await?;
    Ok(())
}


pub async fn update_product_info(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id, product_id)): Path<(String, i64, i64)>,
    multipart: Multipart,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    const MAX_IMAGE_SIZE: usize = 8 * 1024 * 1024;

    let data = 
        MediaService::extract_payload_with_type::<UpdateProductInfoDto>
        (multipart, MAX_IMAGE_SIZE).await?;
    let payload = data.payload;

    let mut tx = state.db_pool.begin().await?;

    let old_images: Vec<ProductImages> = product_repo::get_product_images(&mut tx, product_id).await?;

    let old_map: HashMap<i64, &ProductImages> =
        old_images.iter().map(|img| (img.id, img)).collect();

    let mut seen_ids = HashSet::new();
    let mut delete_ids = Vec::new();
    let mut update_positions = Vec::new();
    let mut create_images = Vec::new();

    let mut file_index = 0;

    for (position, img) in payload.images.iter().enumerate() {
        let pos = position as i32;

        match img.id {
            Some(id) => {
                let _old = old_map.get(&id)
                    .ok_or(MediaServiceError::InternalServer)?;

                // ! prevent duplicate ids in payload
                if !seen_ids.insert(id) {
                    return Err(MediaServiceError::InternalServer.into());
                }

                update_positions.push((id, pos));
            }

            None => {
                // * new image -> consume file
                if file_index >= data.files.len() {
                    return Err(MediaServiceError::MediaMissing.into());
                }

                let file = &data.files[file_index];
                file_index += 1;

                create_images.push((file, pos));
            }
        }
    }

    for old in &old_images {
        if !seen_ids.contains(&old.id) {
            delete_ids.push(old.id);
        }
    }

    product_repo::update_product_info_repo(&mut tx, product_id, shop_id, &payload).await?;

    product_repo::insert_product_specifications(&mut tx, &state, product_id, &payload.specifications).await?;

    for id in delete_ids {
        let img = old_map.get(&id).unwrap();

        state.media_service.delete_old_file(&img.image_url).await;

        product_repo::delete_product_image(&mut tx, id).await?;
    }

    product_repo::offset_product_image_position(&mut tx, product_id, 1000).await?;
    // update positions
    for (id, pos) in update_positions {
        product_repo::update_product_image_position(&mut tx, id, pos).await?;
    }

        for (file, pos) in create_images {
        let options = MediaOptions {
            folder: "products".into(),
            max_size: MAX_IMAGE_SIZE,
            allowed_types: vec![
                AllowedMediaType::Jpeg,
                AllowedMediaType::Png,
            ],
            image_transform: Some(ImageTransform::Resize {
                max_width: 1200,
                max_height: 1200,
            }),
        };

        let url: String = state.media_service.save_media(file, options, None).await?;

        product_repo::insert_product_image_position(&mut tx, &state, product_id, url, pos).await?;
    }

    tx.commit().await?;

    Ok(())
}


pub async fn get_producct_info(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id, product_id)): Path<(String, i64, i64)>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    let mut tx = state.db_pool.begin().await?;

    let product = product_repo::get_product_for_edit(&mut tx, shop_id, product_id).await?;

    tx.commit().await?;

    Ok(Json(product))
}

pub async fn get_product_variant_info (
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, shop_id, product_id, variant_id)): Path<(String, i64,i64,i64)>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let result = product_repo::get_product_variant(&mut tx, shop_id, product_id, variant_id).await?;
    
    Ok(Json(result))
}

pub async fn get_cart_handler(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path(version): Path<String>,
) -> Result<impl IntoResponse, APIError> {
    let user_id = _auth.user_id;
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let cart_items = cart_repo::get_user_cart_items(&mut tx, user_id).await?;

    tx.commit().await?;

    Ok(Json(cart_items))
}

pub async fn add_to_cart_handler(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path(version): Path<String>,
    Json(payload): Json<AddToCartProduct>,
) -> Result<impl IntoResponse, APIError> {
    let user_id = _auth.user_id;
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let item = AddToCartProduct {
        product_id: payload.product_id,
        product_variants_id: payload.product_variants_id,
        quantity: payload.quantity,
    };

    cart_repo::add_to_cart(&mut tx,user_id, item).await?;
    tx.commit().await?;
    
    Ok(Json(()))
}

pub async fn selected_item_handler(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path(version): Path<String>,
    Json(payload): Json<CheckMarkToCart>,
) -> Result<impl IntoResponse, APIError> {
    let user_id = _auth.user_id;
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let check_mark = crate::domain::models::cart::CheckMarkToCart {
        product_id: payload.product_id,
        product_variants_id: payload.product_variants_id,
        is_selected: payload.is_selected,
    };

    cart_repo::check_mark_to_cart(&mut tx, user_id, check_mark).await?;
    tx.commit().await?;

    Ok(())
}

pub async fn set_new_quantity_handler(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path(version): Path<String>,
    Json(payload): Json<AddToCartProduct>,
) -> Result<impl IntoResponse, APIError> {
    let user_id = _auth.user_id;
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let item = AddToCartProduct {
        product_id: payload.product_id,
        product_variants_id: payload.product_variants_id,
        quantity: payload.quantity,
    };

    cart_repo::set_amount_on_cart(&mut tx,user_id, item).await?;
    tx.commit().await?;
    
    Ok(Json(()))
}

pub async fn remove_item_from_cart_handler(
    Extension(_auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path(version): Path<String>,
    Json(payload): Json<AddToCartProduct>,
) -> Result<impl IntoResponse, APIError> {
    let user_id = _auth.user_id;
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    cart_repo::remove_item_from_cart(&mut tx, user_id, payload).await?;
    tx.commit().await?;

    Ok(Json(()))
}