use std::collections::HashMap;

use axum::extract::Multipart;

use crate::{application::{repository::{product_repo}, service::{errors::{MediaServiceError, ProductServiceError}, media_service::{AllowedMediaType, ImageTransform, MediaOptions}}, state::AppState}, domain::models::product::{CreateAttributesDto, CreateProductDto, CreateVariantDto, ProductInfo}};

pub struct ProductService;

impl ProductService {
    // TODO: See list below
    // * create product
    // * delete product
    // ! PATCH everything as a group separately
    // ? We need to make everything modular for easier management
    // ? We may need domain for product

    fn validate_variant_attributes(
        attributes: &[CreateAttributesDto],
        variants: &[CreateVariantDto],
    ) -> Result<(), ProductServiceError> {
        let attribute_map: HashMap<&str, &Vec<String>> = attributes
            .iter()
            .map(|a| (a.name.as_str(), &a.options))
            .collect();

        for variant in variants {
            for (key, value) in &variant.values {

                let allowed_options = attribute_map
                    .get(key.as_str())
                    .ok_or(ProductServiceError::AttributeNotAllow)?;

                if !allowed_options.contains(value) {
                    return Err(ProductServiceError::AttributeNotAllow);
                }
            }

            if variant.values.len() != attributes.len() {
                return Err(ProductServiceError::VariantAttributeMismatch);
            }
        }
        Ok(())
    }


    pub async fn create_product(
        state: &AppState,
        shop_id: i64,
        mut multipart: Multipart,
    ) -> Result<(), ProductServiceError> {
        let mut payload: Option<CreateProductDto> = None;

        let mut product_images = Vec::new();
        let mut variant_images: HashMap<usize, Vec<Vec<u8>>> = HashMap::new();

        // * Keep path that return from uploading images
        let mut product_image_paths: Vec<String> = Vec::new();
        let mut variant_image_paths: HashMap<i64, Vec<String>> = HashMap::new();

        const MAX_IMAGE_SIZE: usize = 8 * 1024 * 1024;

        while let Some(field) = multipart.next_field().await? {
            let name = field.name().unwrap_or("").to_string();

            match name.as_str() {
                "payload" => {
                    let raw = field.text().await?;
                    payload = Some(
                        serde_json::from_str(&raw)
                            .map_err(|_| ProductServiceError::UnableToExtract)?
                    );
                }

                "images" => {
                    let bytes = field.bytes().await?;

                    if bytes.len() > MAX_IMAGE_SIZE {
                        return Err(MediaServiceError::SizeTooLarge.into());
                    }

                    product_images.push(bytes.to_vec());
                }

                _ if name.starts_with("variant_images_") => {
                    let idx: usize = name
                        .trim_start_matches("variant_images_")
                        .parse()
                        .map_err(|_| ProductServiceError::UnableToExtract)?;

                    let bytes = field.bytes().await?;

                    if bytes.len() > MAX_IMAGE_SIZE {
                        return Err(MediaServiceError::SizeTooLarge.into());
                    }

                    variant_images
                        .entry(idx)
                        .or_default()
                        .push(bytes.to_vec());
                }

                _ => {}
            }
        }

        // * Validate if payload exist
        let payload = payload.ok_or(ProductServiceError::UnableToExtract)?;

        // * validate if the attribute correct before inserting
        Self::validate_variant_attributes(&payload.attributes, &payload.variants)?;

        if payload.variants.len() < 1 {
            return Err(ProductServiceError::MissingVariant)
        }
        // TODO: MAKE product domain for types checking

        let mut tx = state.db_pool.begin().await?;

        

        let product_id = state.snowflake_generator.generate_id()?;

        // * create product info props
        let product = ProductInfo {
            id: product_id,
            shop_id,
            name: payload.name,
            description: payload.description,
            has_variants: payload.has_variant,
            deleted_at: None,
            is_active: payload.is_active,
            free_shipping: payload.free_shipping
        };
    
        product_repo::create_product_info(&mut tx, product).await?;

        product_repo::insert_product_specifications(&mut tx, &state, product_id, &payload.specifications).await?;

        // * keep attribute ids for later
        let attrs_with_ids = product_repo::insert_product_attributes(
            &mut tx,
            &state,
            product_id,
            &payload.attributes,
        ).await?;

        let attribute_name_to_id: HashMap<String, i64> =
            payload.attributes
                .iter()
                .zip(attrs_with_ids.iter())
                .map(|(attr, (id, _))| (attr.name.clone(), *id))
                .collect();

        let option_lookup = product_repo::insert_attribute_options(
            &mut tx,
            &state,
            &attrs_with_ids,
        ).await?;

        let variant_ids = product_repo::insert_product_variants(
            &mut tx,
            &state,
            shop_id,
            product_id,
            &payload.variants,
        ).await?;

        product_repo::insert_variant_attribute_values(
            &mut tx,
            &payload.variants,
            &variant_ids,
            &attribute_name_to_id,
            &option_lookup,
        ).await?;

        // * Saving images after everything was success

        for img in product_images {
            let path = state.media_service
                .save_media(
                    &img,
                    MediaOptions {
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
                    },
                    None,
                )
                .await?;

            // * Save image for main product
            product_image_paths.push(path);
        }

        for (variant_index, images) in variant_images {
            let variant_id = variant_ids
                .get(variant_index)
                .ok_or(ProductServiceError::VariantIndexMismatch)?;

            let mut paths = Vec::new();

            for img in images {
                let path = state.media_service
                    .save_media(
                        &img,
                        MediaOptions {
                            folder: "products/variants".into(),
                            max_size: 5_000_000,
                            allowed_types: vec![
                                AllowedMediaType::Jpeg,
                                AllowedMediaType::Png,
                                AllowedMediaType::WebP,
                            ],
                            image_transform: Some(ImageTransform::Resize {
                                max_width: 1200,
                                max_height: 1200,
                            }),
                        },
                        None,
                    )
                    .await?;

                paths.push(path);
            }

            // * Save image for variant product, yipeee, almost done
            variant_image_paths.insert(*variant_id, paths);
        }

        // * Insert everything into db
        product_repo::insert_product_images(
            &mut tx,
            &state,
            product_id,
            &product_image_paths,
        ).await?;

        product_repo::insert_variant_images(
            &mut tx,
            &state,
            &variant_image_paths,
        ).await?;

        tx.commit().await?;

        Ok(())
    }

}