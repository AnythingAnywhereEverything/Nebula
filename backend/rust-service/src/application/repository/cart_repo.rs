use sqlx::{Postgres, Transaction};

use crate::domain::models::{cart::CheckMarkToCart, product::{AddToCartProduct, CartItemResponse}};


pub async fn check_mark_to_cart(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    check_mark: CheckMarkToCart
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE carts
        SET is_selected = $1
        WHERE user_id = $2
        AND product_id = $3::bigint
        AND (
            product_variants_id = $4::bigint
            OR (product_variants_id IS NULL AND $4 IS NULL)
        )
        "#,
    )
    .bind(check_mark.is_selected)
    .bind(user_id)
    .bind(check_mark.product_id)
    .bind(check_mark.product_variants_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn set_amount_on_cart(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    payload: AddToCartProduct,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE carts
        SET quantity = $1
        WHERE user_id = $2
        AND product_id = $3::bigint
        AND (
            product_variants_id = $4::bigint
            OR (product_variants_id IS NULL AND $4 IS NULL)
        )
        "#,
    )
    .bind(payload.quantity)
    .bind(user_id)
    .bind(payload.product_id)
    .bind(payload.product_variants_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn remove_item_from_cart(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    payload: AddToCartProduct,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DELETE FROM carts
        WHERE user_id = $1
        AND product_id = $2::bigint
        AND (
            product_variants_id = $3::bigint
            OR (product_variants_id IS NULL AND $3 IS NULL)
        )
        "#,
    )
    .bind(user_id)
    .bind(payload.product_id)
    .bind(payload.product_variants_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn get_user_cart_items(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
) -> Result<Vec<CartItemResponse>, sqlx::Error> {
    let items = sqlx::query_as(
    r#"
            SELECT 
                c.product_id::text as product_id,
                c.product_variants_id::text as product_variants_id,
                p.name,
                pv.price::BIGINT as price,
                c.quantity,
                p.is_active,
                pv.on_sale,
                pv.sale_price::BIGINT as sale_price,
                p.free_shipping,
                pv.stock_quantity,
                pv.is_enabled,
                c.is_selected,
                COALESCE(piv.image_url, pip.image_url) AS image_url,
                COALESCE(va.spec, '[]'::jsonb) as spec
            FROM carts c
            INNER JOIN products p
                ON c.product_id = p.id
            LEFT JOIN product_variants pv
                ON c.product_variants_id = pv.id
            LEFT JOIN LATERAL (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'name', a.name,
                        'value', ao.value
                    )
                ) as spec
                FROM variant_attribute_values vav
                JOIN attribute_options ao
                    ON ao.id = vav.attribute_option_id
                JOIN attributes a
                    ON a.id = ao.attribute_id
                WHERE vav.variant_id = c.product_variants_id
            ) va ON TRUE
            LEFT JOIN product_images piv
                ON piv.variant_id = c.product_variants_id
            LEFT JOIN product_images pip
                ON pip.product_id = c.product_id
            WHERE c.user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_all(tx.as_mut())
        .await?;

    Ok(items)
}

pub async fn add_to_cart(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    payload: AddToCartProduct
) -> Result<(), sqlx::Error> {
    let _ = sqlx::query(
        r#"
        INSERT INTO carts (user_id, product_id, product_variants_id, quantity)
        VALUES ($1, $2, $3, $4)
        "#
    )
    .bind(user_id)
    .bind(payload.product_id)
    .bind(payload.product_variants_id)
    .bind(payload.quantity)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}