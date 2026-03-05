use std::collections::HashMap;

use sqlx::{Postgres, QueryBuilder, Transaction};

use crate::{
    application::{repository::RepositoryResult, state::AppState},
    domain::models::product::{
        CreateAttributesDto, CreateSpecificationDto, CreateVariantDto, ProductInfo,
    },
};

pub async fn create_product_info(
    tx: &mut Transaction<'_, Postgres>,
    product: ProductInfo,
) -> RepositoryResult<()> {
    sqlx::query(
        r#"
        INSERT INTO products (
            id,
            shop_id,
            name,
            description,
            is_active,
            has_variants,
            free_shipping
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        "#,
    )
    .bind(product.id)
    .bind(product.shop_id)
    .bind(product.name)
    .bind(product.description)
    .bind(product.is_active)
    .bind(product.has_variants)
    .bind(product.free_shipping)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn insert_product_specifications(
    tx: &mut Transaction<'_, Postgres>,
    state: &AppState,
    product_id: i64,
    specs: &[CreateSpecificationDto],
) -> RepositoryResult<()> {
    for spec in specs {
        let id = state
            .snowflake_generator
            .generate_id()
            .map_err(|_| sqlx::Error::InvalidArgument("failed to generate ids".to_string()))?;

        sqlx::query(
            r#"
            INSERT INTO product_specifications (
                id,
                product_id,
                key,
                value
            )
            VALUES ($1, $2, $3, $4)
            "#,
        )
        .bind(id)
        .bind(product_id)
        .bind(&spec.key)
        .bind(&spec.value)
        .execute(tx.as_mut())
        .await?;
    }

    Ok(())
}

pub async fn insert_product_images(
    tx: &mut Transaction<'_, Postgres>,
    state: &AppState,
    product_id: i64,
    images: &[String],
) -> RepositoryResult<()> {

    for (position, image) in images.iter().enumerate() {

        let id = state
            .snowflake_generator
            .generate_id()
            .map_err(|_| sqlx::Error::InvalidArgument("failed to generate ids".to_string()))?;

        sqlx::query(
            r#"
            INSERT INTO product_images (
                id,
                product_id,
                variant_id,
                image_url,
                position
            )
            VALUES ($1, $2, NULL, $3, $4)
            "#
        )
        .bind(id)
        .bind(product_id)
        .bind(image)
        .bind(position as i32) // * preserve frontend order
        .execute(tx.as_mut())
        .await?;
    }

    Ok(())
}

pub async fn insert_variant_images(
    tx: &mut Transaction<'_, Postgres>,
    state: &AppState,
    variant_images: &HashMap<i64, Vec<String>>,
) -> RepositoryResult<()> {

    for (variant_id, images) in variant_images {

        for (position, image) in images.iter().enumerate() {

            let id = state
                .snowflake_generator
                .generate_id()
                .map_err(|_| sqlx::Error::InvalidArgument("failed to generate ids".to_string()))?;

            sqlx::query(
                r#"
                INSERT INTO product_images (
                    id,
                    product_id,
                    variant_id,
                    image_url,
                    position
                )
                VALUES ($1, NULL, $2, $3, $4)
                "#
            )
            .bind(id)
            .bind(variant_id)
            .bind(image)
            .bind(position as i32) // * preserve order per variant
            .execute(tx.as_mut())
            .await?;
        }
    }

    Ok(())
}

pub async fn insert_product_variants(
    tx: &mut Transaction<'_, Postgres>,
    state: &AppState,
    shop_id: i64,
    product_id: i64,
    variants: &[CreateVariantDto],
) -> RepositoryResult<Vec<i64>> {
    if variants.is_empty() {
        return Ok(Vec::new());
    }

    // * generate ids first
    let variant_ids: Vec<i64> = variants
        .iter()
        .map(|_| {
            state
                .snowflake_generator
                .generate_id()
                .map_err(|_| sqlx::Error::InvalidArgument("failed to generate ids".to_string()))
        })
        .collect::<RepositoryResult<_>>()?;

    let mut builder = QueryBuilder::<Postgres>::new(
        "INSERT INTO product_variants (
            id,
            shop_id,
            product_id,
            sku,
            price,
            sale_price,
            cost,
            stock_quantity,
            barcode,
            is_enabled,
            on_sale
        ) ",
    );

    // TODO: Change active to enable in db

    builder.push_values(
        variants.iter().zip(variant_ids.iter()),
        |mut b, (variant, id)| {
            b.push_bind(*id)
                .push_bind(shop_id)
                .push_bind(product_id)
                .push_bind(&variant.sku)
                .push_bind(variant.price.parse::<i64>().unwrap()) // ! assume validated earlier
                .push_bind(
                    variant
                        .sale_price
                        .as_ref()
                        .and_then(|v| v.parse::<i64>().ok()),
                )
                .push_bind(variant.cost.parse::<i64>().unwrap()) // ! assume validated
                .push_bind(variant.stock.parse::<i32>().unwrap()) // ! assume validated
                .push_bind(&variant.barcode)
                .push_bind(variant.is_enabled)
                .push_bind(variant.on_sale);
        },
    );

    builder.build().execute(tx.as_mut()).await?;

    Ok(variant_ids)
}

pub async fn insert_product_attributes(
    tx: &mut Transaction<'_, Postgres>,
    state: &AppState,
    product_id: i64,
    attributes: &[CreateAttributesDto],
) -> RepositoryResult<Vec<(i64, Vec<String>)>> {
    if attributes.is_empty() {
        return Ok(Vec::new());
    }

    // * generate ids and keep options owned
    let attrs_with_ids: Vec<(i64, Vec<String>)> = attributes
        .iter()
        .map(|attr| {
            let id = state
                .snowflake_generator
                .generate_id()
                .map_err(|_| sqlx::Error::InvalidArgument("failed to generate ids".to_string()))?;
            Ok((id, attr.options.clone()))
        })
        .collect::<RepositoryResult<_>>()?;

    let mut builder =
        QueryBuilder::<Postgres>::new("INSERT INTO attributes (id, product_id, name) ");

    builder.push_values(
        attributes.iter().zip(attrs_with_ids.iter()),
        |mut b, (attr, (id, _))| {
            b.push_bind(*id).push_bind(product_id).push_bind(&attr.name);
        },
    );

    builder.build().execute(tx.as_mut()).await?;

    Ok(attrs_with_ids)
}

pub async fn insert_attribute_options(
    tx: &mut Transaction<'_, Postgres>,
    state: &AppState,
    attrs_with_ids: &[(i64, Vec<String>)],
) -> RepositoryResult<HashMap<(i64, String), i64>> {
    let mut rows = Vec::new();
    let mut option_lookup = HashMap::new();

    for (attr_id, options) in attrs_with_ids {
        for value in options {
            let option_id = state
                .snowflake_generator
                .generate_id()
                .map_err(|_| sqlx::Error::InvalidArgument("failed to generate ids".to_string()))?;
            rows.push((option_id, *attr_id, value.clone()));
            option_lookup.insert((*attr_id, value.clone()), option_id);
        }
    }

    if rows.is_empty() {
        return Ok(option_lookup);
    }

    let mut builder =
        QueryBuilder::<Postgres>::new("INSERT INTO attribute_options (id, attribute_id, value) ");

    builder.push_values(rows, |mut b, (id, attr_id, value)| {
        b.push_bind(id).push_bind(attr_id).push_bind(value);
    });

    builder.build().execute(tx.as_mut()).await?;

    Ok(option_lookup)
}

pub async fn insert_variant_attribute_values(
    tx: &mut Transaction<'_, Postgres>,
    variants: &[CreateVariantDto],
    variant_ids: &[i64],
    attribute_name_to_id: &HashMap<String, i64>,
    option_lookup: &HashMap<(i64, String), i64>,
) -> RepositoryResult<()> {
    let mut rows = Vec::new();

    for (variant, variant_id) in variants.iter().zip(variant_ids.iter()) {
        for (attr_name, option_value) in &variant.values {
            let attr_id = attribute_name_to_id
                .get(attr_name)
                .ok_or_else(|| sqlx::Error::InvalidArgument("attribute not found".to_string()))?;

            let option_id = option_lookup
                .get(&(*attr_id, option_value.clone()))
                .ok_or_else(|| sqlx::Error::InvalidArgument("option not found".to_string()))?;

            rows.push((*variant_id, *option_id));
        }
    }

    if rows.is_empty() {
        return Ok(());
    }

    let mut builder = QueryBuilder::<Postgres>::new(
        "INSERT INTO variant_attribute_values (
            variant_id,
            attribute_option_id
        ) ",
    );

    builder.push_values(rows, |mut b, (variant_id, option_id)| {
        b.push_bind(variant_id).push_bind(option_id);
    });

    builder.build().execute(tx.as_mut()).await?;

    Ok(())
}
