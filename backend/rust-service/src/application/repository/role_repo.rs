use sqlx::{Postgres, Transaction};

use crate::{application::{repository::errors::ShopRepoError, service::snowflake_service::SnowflakeGenerator}, domain::role::role::{ShopRole, ShopRoleResponse}};

// * Using for initializing db
pub async fn insert_if_missing(
    pool: &sqlx::PgPool,
    snowflake: &SnowflakeGenerator,
    name: &str,
    description: &str,
    permissions: i64,
    is_superuser: bool,
) -> Result<(), sqlx::Error> {
    let now = chrono::Utc::now().naive_utc();
    let snow_id = snowflake
        .generate_id()
        .map_err(|e| sqlx::Error::Protocol(e.to_string().into()))?; 

    tracing::debug!("Init item name: {}", name);
    sqlx::query(
        r#"
        INSERT INTO roles 
        (id ,name, description, permissions, created_at, updated_at ,is_superuser)
        VALUES ($1, $2, $3, $4, $5 ,$6, $7)
        ON CONFLICT (name) DO NOTHING
        "#,

    )
    .bind(snow_id)
    .bind(name)
    .bind(description)
    .bind(permissions)
    .bind(now)
    .bind(now)
    .bind(is_superuser)
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn get_superuser_role_id(
    tx: &mut Transaction<'_, Postgres>,
    name: &str
) -> Result<i64, sqlx::Error> {
    let item = sqlx::query_scalar(
        r#"
        SELECT id FROM roles
        WHERE name = $1
        "#
    )
    .bind(name)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(item)
}

pub async fn is_superuser_exist(
    pool: &sqlx::PgPool,
    role_id: i64
) -> Result<bool, sqlx::Error> {
    let exists: bool = sqlx::query_scalar(
        r#"
        SELECT EXISTS(
            SELECT 1
            FROM users
            WHERE role_id = $1
        )
        "#
    )
    .bind(role_id)
    .fetch_one(pool)
    .await?;

    Ok(exists)
}

pub async fn set_superadmin(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    role_id: i64
) -> Result<(),  sqlx::Error> {
    let _ = sqlx::query(
        r#"
        UPDATE users
        SET role_id = $1
        WHERE id = $2
        "#
    )
    .bind(role_id)
    .bind(user_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn get_all_roles(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64
) -> Result<Vec<ShopRoleResponse>, ShopRepoError> {

    let roles = sqlx::query_as::<_, ShopRoleResponse>(
        r#"
        SELECT id::text as id, name, description, permissions
        FROM shop_roles
        WHERE shop_id = $1
        "#
    )
    .bind(shop_id)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(roles)
}

pub async fn add_new_role(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
    payload: ShopRole
) -> Result<ShopRoleResponse, ShopRepoError> {
    let now = chrono::Utc::now().naive_utc();
    let role:ShopRole = sqlx::query_as(
        r#"
            INSERT INTO shop_roles
            (id, shop_id, name, description, permissions, created_at, updated_at)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        "#
    )
    .bind(payload.id)
    .bind(shop_id)
    .bind(payload.name)
    .bind(payload.description)
    .bind(payload.permissions)
    .bind(now)
    .bind(now)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(role.into())
}

pub async fn update_ship_role(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
    payload: ShopRole
) -> Result<(), ShopRepoError> {
    sqlx::query(
        r#"
            UPDATE shop_roles
            SET name = $1, description = $2, permissions = $3, updated_at = $4
            WHERE id = $5 AND shop_id = $6
        "#
    )
    .bind(payload.name)
    .bind(payload.description)
    .bind(payload.permissions)
    .bind(chrono::Utc::now().naive_utc())
    .bind(payload.id)
    .bind(shop_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}
pub async fn delete_shop_role(
    tx: &mut Transaction<'_, Postgres>,
    shop_id: i64,
    role_id: i64
) -> Result<(), ShopRepoError> {
    sqlx::query(
        r#"
            DELETE FROM shop_roles
            WHERE id = $1 AND shop_id = $2
        "#
    )
    .bind(role_id)
    .bind(shop_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}