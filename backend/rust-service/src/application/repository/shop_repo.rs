use sqlx::{Postgres, Transaction};

use crate::{application::repository::errors::ShopRepoError, domain::models::shop::{NewShop, Shop}};

pub async fn is_shop_exist (
    tx: &mut Transaction<'_, Postgres>,
    shop_name: String
) -> Result<bool, ShopRepoError> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM shops WHERE name = $1")
        .bind(shop_name)
        .fetch_one(tx.as_mut())
        .await
        .map_err(|_| ShopRepoError::FailedToCreateShop)?;
    Ok(count > 0)
}

pub async fn create_shop(
    tx: &mut Transaction<'_, Postgres>,
    shop : NewShop
) -> Result<(), ShopRepoError> {
    tracing::trace!("Shop: {:#?}", shop);
    sqlx::query(
        r#"
        INSERT INTO shops (id, name, description, owner_id, is_brand, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
    )
    .bind(shop.id)
    .bind(shop.name)
    .bind(shop.description)
    .bind(shop.owner_id)
    .bind(shop.is_brand)
    .bind(chrono::Utc::now().naive_utc())
    .execute(tx.as_mut())
    .await
    .map_err(|_| ShopRepoError::FailedToCreateShop)?;
    Ok(())
}

pub async fn get_shop_by_owner_id(
    tx: &mut Transaction<'_, Postgres>,
    owner_id: i64,
) -> Result<Vec<Shop>, ShopRepoError> {
    let shops = sqlx::query_as::<_, Shop>(
        r#"
        SELECT id, name, description, owner_id, is_brand, created_at, updated_at
        FROM shops
        WHERE owner_id = $1
        "#,
    )
    .bind(owner_id)
    .fetch_all(tx.as_mut())
    .await
    .map_err(|_| ShopRepoError::FailedToGetShop)?;
    Ok(shops)
}

pub async fn get_shop_by_member_id(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
) -> Result<Vec<Shop>, ShopRepoError> {
    let shops = sqlx::query_as::<_, Shop>(
        r#"
        SELECT s.id, s.name, s.description, s.owner_id, s.is_brand, s.created_at, s.updated_at
        FROM shops s
        JOIN shop_members sm ON s.id = sm.shop_id
        WHERE sm.user_id = $1
        "#,
    )
    .bind(user_id)
    .fetch_all(tx.as_mut())
    .await
    .map_err(|_| ShopRepoError::FailedToGetShop)?;
    Ok(shops)
}