
//* this file is for separate the hell and the heaven */

use rust_decimal::Decimal;
use sqlx::{Postgres, Transaction};

use crate::{application::repository::RepositoryResult, domain::models::{product::ReturnProductSpecification, search::{ProductOption, ProductPageVariant, ProductRow, QueryProductData, TypingQueryProduct}}};

pub async fn query_product_names(
    tx: &mut Transaction<'_, Postgres>,
    query: String
) -> RepositoryResult<Vec<TypingQueryProduct>> {
    let result = sqlx::query_as::<_, TypingQueryProduct>(
        r#"
        SELECT
            id::text as id,
            name,
            shop_id::text as shop_id 
        FROM products
        WHERE
            deleted_at IS NULL
            AND is_active = true
            AND name ILIKE '%' || $1 || '%'
        ORDER BY sold DESC
        LIMIT 20;
        "#
    )
    .bind(query)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(result)
}

pub async fn query_product_datas(
    tx: &mut Transaction<'_, Postgres>,
    query: Option<String>,
    offset: i64,
    limit: i64,
    rating: Option<Decimal>,
    min_price: Option<i64>,
    max_price: Option<i64>,
    shop_id: Option<i64>
) -> RepositoryResult<Vec<QueryProductData>> {
    let result = sqlx::query_as::<_, QueryProductData>(
        r#"
        SELECT
            v.id::text,
            p.name,
            p.rating::text,

            img.image_url AS product_image,

            v.price::text,
            v.on_sale,
            v.sale_price::text

        FROM products p

        LEFT JOIN LATERAL (
            SELECT image_url
            FROM product_images
            WHERE product_id = p.id
            ORDER BY position ASC
            LIMIT 1
        ) img ON TRUE

        JOIN LATERAL (
            SELECT price, on_sale, sale_price, id
            FROM product_variants
            WHERE
                product_id = p.id
                AND deleted_at IS NULL
                AND is_enabled = TRUE
                AND ($7 IS NULL OR shop_id = $7)
            ORDER BY price ASC
            LIMIT 1
        ) v ON TRUE

        WHERE
            p.deleted_at IS NULL
            AND p.is_active = TRUE
            AND ($1 IS NULL OR p.name ILIKE '%' || $1 || '%')

            AND ($4 IS NULL OR p.rating >= $4)

            AND ($5 IS NULL OR v.price >= $5)
            AND ($6 IS NULL OR v.price <= $6)

        ORDER BY
            (
                (CASE WHEN p.name ILIKE '%' || $1 || '%' THEN 5 ELSE 0 END)
                + p.sold * 0.02
                + p.rating * 2
                + p.review_amount * 0.1
                + 1 / (EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 86400 + 1)
            ) DESC

        LIMIT $2
        OFFSET $3
        "#
    )
    .bind(query)
    .bind(limit)
    .bind(offset)
    .bind(rating)
    .bind(min_price)
    .bind(max_price)
    .bind(shop_id)    
    .fetch_all(tx.as_mut())
    .await?;

    Ok(result)
}

pub async fn count_search_products(
    tx: &mut Transaction<'_, Postgres>,
    query: Option<String>,
    rating: Option<Decimal>,
    min_price: Option<i64>,
    max_price: Option<i64>,
    shop_id: Option<i64>,
) -> RepositoryResult<i64> {
    let count: (i64,) = sqlx::query_as(
        r#"
        SELECT COUNT(DISTINCT p.id)
        FROM products p

        LEFT JOIN product_variants v
            ON v.product_id = p.id
            AND v.deleted_at IS NULL
            AND v.is_enabled = TRUE
            AND ($5 IS NULL OR v.shop_id = $5)

        WHERE
            p.deleted_at IS NULL
            AND p.is_active = TRUE
            AND ($1 IS NULL OR p.name ILIKE '%' || $1 || '%')
            
            AND ($2 IS NULL OR p.rating >= $2)

            AND ($3 IS NULL OR v.price >= $3)
            AND ($4 IS NULL OR v.price <= $4)
        "#
    )
    .bind(query)      // $1
    .bind(rating)     // $2
    .bind(min_price)  // $3
    .bind(max_price)  // $4
    .bind(shop_id)    // $5
    .fetch_one(tx.as_mut())
    .await?;

    Ok(count.0)
}

pub async fn query_product_options(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64
) -> RepositoryResult<Vec<ProductOption>> {
    let result = sqlx::query_as::<_, ProductOption>(
        r#"
        SELECT
            a.name,
            array_agg(ao.value ORDER BY ao.value) AS values
        FROM attributes a
        JOIN attribute_options ao
            ON ao.attribute_id = a.id
        WHERE
            a.product_id = $1
            AND a.deleted_at IS NULL
        GROUP BY a.name
        ORDER BY a.name
        "#
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(result)
}

pub async fn query_product_variants(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64
) -> RepositoryResult<Vec<ProductPageVariant>> {
    let result = sqlx::query_as::<_, ProductPageVariant>(
        r#"
        SELECT
            v.id::text,
            v.price,
            v.sale_price,
            v.on_sale,
            v.stock_quantity::text AS stock,

            COALESCE(vi.images, '{}') || COALESCE(pi.images, '{}') AS images,

            COALESCE(
                jsonb_object_agg(a.name, ao.value) 
                    FILTER (WHERE a.name IS NOT NULL),
                '{}'::jsonb
            ) AS attributes

        FROM product_variants v

        LEFT JOIN variant_attribute_values vav
            ON vav.variant_id = v.id

        LEFT JOIN attribute_options ao
            ON ao.id = vav.attribute_option_id

        LEFT JOIN attributes a
            ON a.id = ao.attribute_id

        -- variant images
        LEFT JOIN LATERAL (
            SELECT array_agg(image_url ORDER BY position) AS images
            FROM product_images
            WHERE variant_id = v.id
        ) vi ON TRUE

        -- product images
        LEFT JOIN LATERAL (
            SELECT array_agg(image_url ORDER BY position) AS images
            FROM product_images
            WHERE product_id = v.product_id
        ) pi ON TRUE

        WHERE
            v.product_id = $1
            AND v.deleted_at IS NULL

        GROUP BY
            v.id,
            vi.images,
            pi.images
        "#
    )
    .bind(product_id)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(result)
}

pub async fn query_product_specification(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64
) -> RepositoryResult<Vec<ReturnProductSpecification>> {
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

    Ok(specifications)
}

pub async fn query_product(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64
) -> RepositoryResult<ProductRow> {
    let result: ProductRow = sqlx::query_as::<_, ProductRow>(
        r#"
        SELECT
            p.id::text,
            s.name AS store_name,
            s.id::text AS store_id,

            p.free_shipping,
            p.name,
            p.description,
            p.has_variants,

            p.rating::text,
            p.review_amount::text,
            p.sold::text

        FROM products p
        JOIN shops s
            ON s.id = p.shop_id

        WHERE
            p.id = $1
            AND p.deleted_at IS NULL
            AND p.is_active = TRUE
        "#
    )
    .bind(product_id)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(result)
}