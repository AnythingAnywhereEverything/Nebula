use std::collections::HashMap;

use rust_decimal::Decimal;
use sqlx::{Postgres, QueryBuilder, Transaction};

use crate::{
    application::{repository::RepositoryResult, state::AppState},
    domain::models::product::{
        CreateAttributesDto, CreateSpecificationDto, CreateVariantDto, EditAttributeOptionRow, EditAttributeRow, EditProductRow, EditVariantRow, EditVariantValueRow, GetProductEdit, GetShopProduct, GetVariantEdit, ProductImageRow, ProductImages, ProductInfo, ReturnProductSpecification, UpdateProductInfoDto
    },
};

pub async fn get_product_id_from_variant(
    tx: &mut Transaction<'_, Postgres>,
    variant_id: i64,
) -> RepositoryResult<i64> {
    let product_id: i64 = sqlx::query_scalar(
        r#"
        SELECT product_id
        FROM product_variants
        WHERE id = $1
        AND deleted_at IS NULL
        "#
    )
    .bind(variant_id)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(product_id)
}

pub async fn update_product_settings(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    shop_id: i64,
    active: bool,
    free_shipping: bool,
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
            UPDATE products
            SET
                is_active = $1,
                free_shipping = $2
            WHERE
                id = $3
                AND shop_id = $4
                AND deleted_at IS NULL
        "#
    )
    .bind(active)
    .bind(free_shipping)
    .bind(id)
    .bind(shop_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn delete_product(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    shop_id: i64
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
            UPDATE products
            SET
                deleted_at = NOW(),
                updated_at = NOW()
            WHERE
                id = $1
                AND shop_id = $2
                AND deleted_at IS NULL
        "#
    )
    .bind(id)
    .bind(shop_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn insert_variant_attribute_value(
    tx: &mut Transaction<'_, Postgres>,
    variant_id: i64,
    option_id: i64
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
            INSERT INTO variant_attribute_values
            (
                variant_id,
                attribute_option_id
            )
            VALUES
            (
                $1,$2
            )
        "#
    )
    .bind(variant_id)
    .bind(option_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn insert_product_variant(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    shop_id: i64,
    product_id: i64,
    sku: &str,
    price: &Decimal,
    sale_price: Option<&Decimal>,
    cost: &Decimal,
    on_sale: bool,
    stock: i32,
    barcode: Option<&str>
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
            INSERT INTO product_variants
            (
                id,
                shop_id,
                product_id,
                sku,
                price,
                sale_price,
                cost,
                on_sale,
                stock_quantity,
                barcode
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
            )
        "#
    )
    .bind(id)
    .bind(shop_id)
    .bind(product_id)
    .bind(sku)
    .bind(price)
    .bind(sale_price)
    .bind(cost)
    .bind(on_sale)
    .bind(stock)
    .bind(barcode)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn validate_attribute_options_belong_to_product(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64,
    option_ids: &[i64]
) -> RepositoryResult<i64> {
    let count: (i64,) = sqlx::query_as(
        r#"
            SELECT COUNT(*)
            FROM attribute_options ao
            JOIN attributes a ON a.id = ao.attribute_id
            WHERE
                ao.id = ANY($1)
                AND a.product_id = $2
                AND ao.deleted_at IS NULL
                AND a.deleted_at IS NULL
        "#
    )
    .bind(option_ids)
    .bind(product_id)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(count.0)
}

pub async fn duplicate_attribute_in_options(
    tx: &mut Transaction<'_, Postgres>,
    option_ids: &[i64]
) -> RepositoryResult<bool> {
    let exists: Option<(i64,)> = sqlx::query_as(
        r#"
            SELECT ao.attribute_id
            FROM attribute_options ao
            WHERE ao.id = ANY($1)
            GROUP BY ao.attribute_id
            HAVING COUNT(*) > 1
        "#
    )
    .bind(option_ids)
    .fetch_optional(tx.as_mut())
    .await?;

    Ok(exists.is_some())
}

pub async fn variant_combination_exists(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64,
    option_ids: &[i64]
) -> RepositoryResult<bool> {
    let exists: Option<(i64,)> = sqlx::query_as(
        r#"
            SELECT vav.variant_id
            FROM variant_attribute_values vav
            JOIN product_variants v ON v.id = vav.variant_id
            WHERE
                v.product_id = $1
                AND v.deleted_at IS NULL
                AND vav.attribute_option_id = ANY($2)
            GROUP BY vav.variant_id
            HAVING COUNT(*) = $3
        "#
    )
    .bind(product_id)
    .bind(option_ids)
    .bind(option_ids.len() as i64)
    .fetch_optional(tx.as_mut())
    .await?;

    Ok(exists.is_some())
}

pub async fn update_product_image_position(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    pos: i32
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
            UPDATE product_images
            SET
                position = $1
            WHERE
                id = $2
        "#
    )
    .bind(pos)
    .bind(id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn offset_product_image_position(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    offset: i32
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
            UPDATE product_images
            SET position = position + $1
            WHERE product_id = $2;
        "#
    )
    .bind(offset)
    .bind(id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn insert_product_image_position(
    tx: &mut Transaction<'_, Postgres>,
    state: &AppState,
    product_id: i64,
    url: String,
    position: i32
) -> RepositoryResult<()> {

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
        "#,
    )
    .bind(id)
    .bind(product_id)
    .bind(url)
    .bind(position) 
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn delete_product_image(
    tx: &mut Transaction<'_, Postgres>,
    id: i64
) -> RepositoryResult<()> {
    sqlx::query(
        r#"
            DELETE FROM product_images
            WHERE id = $1
        "#
    )
    .bind(id)
    .execute(tx.as_mut())
    .await?;
    Ok(())
}

pub async fn get_product_images(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64,
) -> RepositoryResult<Vec<ProductImages>> {
    let result = sqlx::query_as::<_, ProductImages>(
        r#"
            SELECT
                id,
                product_id,
                variant_id,
                image_url,
                position
            FROM product_images
            WHERE product_id = $1
            ORDER BY position
        "#,
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(result)
}

// * ---------------------------
// * VARIANTS IMAGES (help :sob: )
// * ---------------------------

pub async fn update_product_variant(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    product_id: i64,
    shop_id: i64,
    sku: &str,
    price: &Decimal,
    sale_price: Option<&Decimal>,
    cost: &Decimal,
    on_sale: bool,
    stock: i32,
    barcode: Option<&str>
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
            UPDATE product_variants
            SET
                sku = $1,
                price = $2,
                sale_price = $3,
                cost = $4,
                on_sale = $5,
                stock_quantity = $6,
                barcode = $7,
                updated_at = NOW()
            WHERE
                id = $8
                AND product_id = $9
                AND shop_id = $10
                AND deleted_at IS NULL
        "#
    )
    .bind(sku)
    .bind(price)
    .bind(sale_price)
    .bind(cost)
    .bind(on_sale)
    .bind(stock)
    .bind(barcode)
    .bind(id)
    .bind(product_id)
    .bind(shop_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn offset_variant_image_position(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    offset: i32
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
            UPDATE product_images
            SET position = position + $1
            WHERE variant_id = $2;
        "#
    )
    .bind(offset)
    .bind(id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn insert_variant_image_position(
    tx: &mut Transaction<'_, Postgres>,
    state: &AppState,
    variant_id: i64,
    url: String,
    position: i32
) -> RepositoryResult<()> {

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
        "#,
    )
    .bind(id)
    .bind(variant_id)
    .bind(url)
    .bind(position) 
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn get_variant_images(
    tx: &mut Transaction<'_, Postgres>,
    variant_id: i64,
) -> RepositoryResult<Vec<ProductImages>> {
    let result = sqlx::query_as::<_, ProductImages>(
        r#"
            SELECT
                id,
                product_id,
                variant_id,
                image_url,
                position
            FROM product_images
            WHERE variant_id = $1
            ORDER BY position
        "#,
    )
    .bind(variant_id)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(result)
}

pub async fn update_product_info_repo(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64,
    shop_id: i64,
    payload: &UpdateProductInfoDto,
) -> RepositoryResult<()> {
    sqlx::query(
        r#"
            UPDATE products SET
                name = $1,
                description = $2
            WHERE
                id = $3
            AND shop_id = $4
        "#,
    )
    .bind(&payload.name)
    .bind(&payload.description)
    .bind(product_id)
    .bind(shop_id)
    .execute(tx.as_mut())
    .await?;

    // * scope reduction must've been insane
    sqlx::query(
        r#"
            DELETE FROM product_specifications
            WHERE product_id = $1
        "#,
    )
    .bind(product_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn get_product_variant(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
    product_id: i64,
    variant_id: i64,
) -> RepositoryResult<GetVariantEdit> {
    let variant = sqlx::query_as::<_, EditVariantRow>(
        r#"
        SELECT
            id::text as id,
            sku,
            price::text as price,
            sale_price::text as sale_price,
            cost::text as cost,
            on_sale,
            stock_quantity::text as stock,
            barcode,
            is_enabled
        FROM product_variants
        WHERE 
            shop_id = $1
        AND product_id = $2 
        AND id = $3
        AND deleted_at IS NULL
        "#,
    )
    .bind(shop_id)
    .bind(product_id)
    .bind(variant_id)
    .fetch_one(tx.as_mut())
    .await?;

    let variant_images = sqlx::query_as::<_, ProductImageRow>(
        r#"
        SELECT
            id::text as id,
            product_id::text as product_id,
            variant_id::text as variant_id,
            image_url,
            position
        FROM product_images
        WHERE variant_id = $1
        ORDER BY position
        "#,
    )
    .bind(variant_id)
    .fetch_all(tx.as_mut())
    .await?;

    let result = GetVariantEdit {
        variant,
        variant_images,
    };

    Ok(result)
}

pub async fn get_product_for_edit(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
    product_id: i64,
) -> RepositoryResult<GetProductEdit> {
    // * product
    let product = sqlx::query_as::<_, EditProductRow>(
        r#"
        SELECT
            id::text as id,
            shop_id::text as shop_id,
            name,
            description,
            has_variants,
            is_active,
            free_shipping,
            deleted_at
        FROM products
        WHERE id = $1
        AND shop_id = $2
        AND deleted_at IS NULL
        "#,
    )
    .bind(product_id)
    .bind(shop_id)
    .fetch_one(tx.as_mut())
    .await?;

    let product_images = sqlx::query_as::<_, ProductImageRow>(
        r#"
        SELECT
            id::text as id,
            product_id::text as product_id,
            variant_id::text as variant_id,
            image_url,
            position
        FROM product_images
        WHERE product_id = $1
        ORDER BY position
        "#,
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    // * specifications
    let specifications = sqlx::query_as::<_, ReturnProductSpecification>(
        r#"
        SELECT
            id::text as id,
            name as key,
            value
        FROM product_specifications
        WHERE product_id = $1
        AND deleted_at IS NULL
        "#,
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    // * variants
    let variants = sqlx::query_as::<_, EditVariantRow>(
        r#"
        SELECT
            id::text as id,
            sku,
            price::text as price,
            sale_price::text as sale_price,
            cost::text as cost,
            on_sale,
            stock_quantity::text as stock,
            barcode,
            is_enabled
        FROM product_variants
        WHERE product_id = $1
        AND deleted_at IS NULL
        "#,
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    // * if no variants
    if !product.has_variants {
        return Ok(GetProductEdit {
            product,
            attributes: vec![],
            attribute_options: vec![],
            variant_values: vec![],
            variants: variants,
            specifications,
            product_images: product_images,
        });
    }

    // * attributes
    let attributes = sqlx::query_as::<_, EditAttributeRow>(
        r#"
        SELECT
            id::text as id,
            name
        FROM attributes
        WHERE product_id = $1
        AND deleted_at IS NULL
        "#,
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    // * attribute options
    let options = sqlx::query_as::<_, EditAttributeOptionRow>(
        r#"
        SELECT
            id::text as id,
            attribute_id::text as attribute_id,
            value
        FROM attribute_options
        WHERE attribute_id IN (
            SELECT id FROM attributes
            WHERE product_id = $1
            AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
        "#,
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    // * variant attribute mapping
    let variant_values = sqlx::query_as::<_, EditVariantValueRow>(
        r#"
        SELECT
            vav.variant_id::text as variant_id,
            vav.attribute_option_id::text as attribute_option_id
        FROM variant_attribute_values vav
        JOIN product_variants pv
            ON pv.id = vav.variant_id
        WHERE pv.product_id = $1
        AND pv.deleted_at IS NULL
        "#,
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(GetProductEdit {
        product,
        attributes,
        attribute_options: options,
        variant_values,
        variants,
        specifications,
        product_images,
    })
}

pub async fn get_shop_products(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
) -> RepositoryResult<Vec<GetShopProduct>> {
    let products = sqlx::query_as::<_, GetShopProduct>(
        r#"
        SELECT
            p.id::text as id,
            p.name,
            p.description,
            p.has_variants,
            p.is_active,
            p.free_shipping,

            img.image_url,

            COALESCE(v.variant_count, 0) as variant_count,
            COALESCE(v.total_stock, 0) as total_stock,

            p.created_at,
            p.updated_at,
            p.deleted_at

        FROM products p

        LEFT JOIN LATERAL (
            SELECT image_url
            FROM product_images
            WHERE product_id = p.id
            ORDER BY position ASC
            LIMIT 1
        ) img ON TRUE

        LEFT JOIN LATERAL (
            SELECT
                COUNT(*) as variant_count,
                COALESCE(SUM(stock_quantity), 0) as total_stock
            FROM product_variants
            WHERE product_id = p.id
            AND deleted_at IS NULL
        ) v ON TRUE

        WHERE p.shop_id = $1
        AND p.deleted_at IS NULL
        ORDER BY p.created_at DESC
        "#,
    )
    .bind(shop_id)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(products)
}

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
                name,
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
            "#,
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
                "#,
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
                .push_bind(variant.price)
                .push_bind(
                    variant
                        .sale_price
                        .as_ref()
                )
                .push_bind(variant.cost)
                .push_bind(variant.stock.parse::<i32>().unwrap())
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