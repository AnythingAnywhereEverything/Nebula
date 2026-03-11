use sqlx::{Postgres, Transaction};

use crate::{application::repository::{RepositoryResult, errors::ShopRepoError}, domain::models::shop::{MemberResponse, NewShop, Shop, ShopUpdateData}};

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

pub async fn get_shop_product_total(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
) -> RepositoryResult<i64> {
    let total: (i64,) = sqlx::query_as(
        r#"
        SELECT COUNT(*)
        FROM products
        WHERE
            shop_id = $1
            AND deleted_at IS NULL
        "#
    )
    .bind(shop_id)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(total.0)
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
        SELECT *
        FROM shops
        WHERE owner_id = $1
        "#,
    )
    .bind(owner_id)
    .fetch_all(tx.as_mut())
    .await
    .map_err(|_| ShopRepoError::ShopNotFound)?;
    Ok(shops)
}

pub async fn get_shop_by_member_id(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
) -> Result<Vec<Shop>, ShopRepoError> {
    let shops = sqlx::query_as::<_, Shop>(
        r#"
        SELECT s.id, s.name, s.description, s.owner_id, s.is_brand, s.created_at, s.updated_at, shop_profile_url, shop_banner_url
        FROM shops s
        JOIN shop_members sm ON s.id = sm.shop_id
        WHERE sm.user_id = $1
        "#,
    )
    .bind(user_id)
    .fetch_all(tx.as_mut())
    .await
    .map_err(|_| ShopRepoError::ShopNotFound)?;
    Ok(shops)
}
// * router query
pub async fn get_current_shop_by_shop_id(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
) -> Result<Shop, ShopRepoError >{
    let shop = sqlx::query_as::<_, Shop>(
        r#"
        SELECT *
        FROM shops
        WHERE id = $1
        "#
    )
    .bind(shop_id)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(shop)
}

pub async fn update_info_shop(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    shop: ShopUpdateData
)-> Result<(),ShopRepoError> {
    let _ = sqlx::query(
        r#"
        UPDATE shops
        SET name = $1,
            description = $2,
            updated_at = $3
        WHERE id = $4
        "#
    )
    .bind(shop.name)
    .bind(shop.description)
    .bind(chrono::Utc::now().naive_utc())
    .bind(id)
    .execute(tx.as_mut())
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => ShopRepoError::ShopNotFound,
        _ => ShopRepoError::from(e),
    })?;

    Ok(())
}

pub async fn update_profile_shop(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    shop: Shop,
)-> Result<(),ShopRepoError> {
    let _ = sqlx::query(
        r#"
        UPDATE shops
        SET shop_profile_url = $1,
        updated_at = $2
        WHERE id = $3
        "#
    )
    .bind(shop.shop_profile_url)
    .bind(chrono::Utc::now().naive_utc())
    .bind(id)
    .execute(tx.as_mut())
    .await
    .map_err(|_| ShopRepoError::FailedToUpdateShop);

    Ok(())
}

pub async fn update_banner_shop(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    shop: Shop,
)-> Result<(),ShopRepoError> {
    let _ = sqlx::query(
        r#"
        UPDATE shops
        SET shop_banner_url = $1,
        updated_at = $2
        WHERE id = $3
        "#
    )
    .bind(shop.shop_banner_url)
    .bind(chrono::Utc::now().naive_utc())
    .bind(id)
    .execute(tx.as_mut())
    .await
    .map(|_| ShopRepoError::ShopNotFound);

    Ok(())
}

// pub async fn add_shop_member(
//     tx: &mut Transaction<'_, Postgres>,
//     payload: ShopMember
// ) -> Result<(), ShopRepoError> {
//     let now = chrono::Utc::now().naive_utc();
//     let _ = sqlx::query(
//         r#"
//         INSERT INTO shop_members
//         (id, shop_id, user_id, role, created_at, updated_at)
//         VALUES ($1, $2 ,$3, $4, $5, $6)
//         "#
//     )
//     .bind(payload.id)
//     .bind(payload.shop_id)
//     .bind(payload.user_id)
//     .bind(payload.role)
//     .bind(now)
//     .bind(now)
//     .execute(tx.as_mut())
//     .await
//     .map_err(|_| ShopRepoError::ShopNotFound);

//     Ok(())
// }

pub async fn is_member_exist(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
    user_id: i64
) -> Result<bool, ShopRepoError> {
    let count: i64 = sqlx::query_scalar(
        r#"SELECT COUNT(*)
            FROM shop_members 
            WHERE shop_id = $1 AND user_id = $2"#
    )
        .bind(shop_id)
        .bind(user_id)
        .fetch_one(tx.as_mut())
        .await
        .map_err(|_| ShopRepoError::MemberIsExist)?;

    Ok(count > 0)
}

pub async fn get_shop_member_by_shop_id(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64
) -> Result<Vec<MemberResponse>, ShopRepoError> {
    let members = sqlx::query_as::<_, MemberResponse>(
        r#"
        SELECT sm.id, sm.shop_id, sm.role, u.profile_picture_url 
        FROM shop_members sm
        INNER JOIN users u ON sm.user_id = u.id
        INNER JOIN shop_roles sr ON sm.shop_id = sr.shop_id
        WHERE sm.shop_id = $1
        "#
    )
    .bind(shop_id)
    .fetch_all(tx.as_mut())
    .await
    .map_err(|_| ShopRepoError::ShopNotFound)?;

    Ok(members)
}

pub async fn is_owner_shop(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
    user_id: i64
) -> Result<bool, ShopRepoError> {
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
            FROM shops 
            WHERE id = $1 AND owner_id = $2"#
    )
        .bind(shop_id)
        .bind(user_id)
        .fetch_one(tx.as_mut())
        .await
        .map_err(|_| ShopRepoError::ShopNotFound)?;

    Ok(count > 0)
}