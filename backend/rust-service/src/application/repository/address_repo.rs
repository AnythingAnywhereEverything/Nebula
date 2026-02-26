use chrono::Utc;
use sqlx::{Postgres, Transaction};

use crate::{application::repository::RepositoryResult, domain::models::address::{Address, NewAddress}};

pub async fn update(
    tx: &mut Transaction<'_, Postgres>,
    address_id: i64,
    user_id: i64,
    addr: NewAddress
) -> RepositoryResult<Address> {
    tracing::trace!("address: {:#?}", addr);
    let time_now = Utc::now().naive_utc();

    let address = sqlx::query_as::<_, Address>(
        r#"
        UPDATE addresses
        SET
            address_line1 = $1,
            address_line2 = $2,
            state = $3,
            city = $4,
            country = $5,
            phone_number = $6,
            zip_code = $7,
            updated_at = $8,
            full_name = $9
        WHERE id = $10 AND user_id = $11
        RETURNING
            addresses.*,
            (
                addresses.id = (
                    SELECT default_shipping_address_id
                    FROM users
                    WHERE users.id = addresses.user_id
                )
            ) AS is_default
        "#
    )
    .bind(addr.address_line1)
    .bind(addr.address_line2)
    .bind(addr.state)
    .bind(addr.city)
    .bind(addr.country)
    .bind(addr.phone_number)
    .bind(addr.zip_code)
    .bind(time_now)
    .bind(addr.full_name)
    .bind(address_id)
    .bind(user_id)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(address)
}

pub async fn add(
    tx: &mut Transaction<'_, Postgres>,
    addr: NewAddress
) -> RepositoryResult<Address> {
    tracing::trace!("address: {:#?}", addr);
    let time_now = Utc::now().naive_utc();

    let address = sqlx::query_as::<_, Address>(
    r#"
        INSERT INTO addresses (
            id,
            user_id,
            address_line1,
            address_line2,
            state,
            city,
            country,
            phone_number,
            zip_code,
            created_at,
            updated_at,
            full_name
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING
            addresses.*,
            (
                addresses.id = (
                    SELECT default_shipping_address_id
                    FROM users
                    WHERE users.id = addresses.user_id
                )
            ) AS is_default
        "#
    )
    .bind(addr.id)
    .bind(addr.user_id)
    .bind(addr.address_line1)
    .bind(addr.address_line2)
    .bind(addr.state)
    .bind(addr.city)
    .bind(addr.country)
    .bind(addr.phone_number)
    .bind(addr.zip_code)
    .bind(time_now)
    .bind(time_now)
    .bind(addr.full_name)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(address)
}

pub async fn update_default_address(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    is_default: bool,
    address: Address
) -> RepositoryResult<()> {
    // Update the user's default shipping address
    // Update if is_default is true, else set nothing
    if is_default {
        sqlx::query(
            r#"
            UPDATE users
            SET default_shipping_address_id = $1
            WHERE id = $2
            "#
        )        
        .bind(address.id)
        .bind(user_id)
        .execute(tx.as_mut())
        .await?;
    } else {
        // If is_default is false, we need to check if the current default address is the one being updated
        let current_default_address_id: Option<i64> = sqlx::query_scalar(
            r#"
            SELECT default_shipping_address_id
            FROM users
            WHERE id = $1
            "#
        )
        .bind(user_id)
        .fetch_one(tx.as_mut())
        .await?;

        // If the current default address is the one being updated, we need to set it to null
        if current_default_address_id == Some(address.id) {
            sqlx::query(
                r#"
                UPDATE users
                SET default_shipping_address_id = NULL
                WHERE id = $1
                "#
            )        
            .bind(user_id)
            .execute(tx.as_mut())
            .await?;
        }
    }
    Ok(())
}

pub async fn get_by_user_id(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64
) -> RepositoryResult<Vec<Address>> {
    let addresses = sqlx::query_as::<_, Address>(
        r#"
        SELECT
            a.*,
            (a.id = u.default_shipping_address_id) AS is_default
        FROM addresses a
        JOIN users u ON u.id = a.user_id
        WHERE a.user_id = $1;
        "#
    )
    .bind(user_id)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(addresses)
}

pub async fn delete(
    tx: &mut Transaction<'_, Postgres>,
    address_id: i64,
    user_id: i64
) -> RepositoryResult<bool> {
    let result = sqlx::query(
        r#"
        DELETE FROM addresses
        WHERE id = $1 AND user_id = $2
        "#
    )
    .bind(address_id)
    .bind(user_id)
    .execute(tx.as_mut())
    .await?;

    Ok(result.rows_affected() == 1)
}

pub async fn set_default_address_id(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    address_id: Option<i64>,
) -> RepositoryResult<()> {
    let time_now = Utc::now().naive_utc();

    // check if the address_id belongs to the user
    if let Some(addr_id) = address_id {
        let addr_user_id: Option<i64> = sqlx::query_scalar(
            r#"
            SELECT user_id
            FROM addresses
            WHERE id = $1
            "#
        )
        .bind(addr_id)
        .fetch_one(tx.as_mut())
        .await?;

        if addr_user_id != Some(user_id) {
            return Err(sqlx::Error::RowNotFound.into());
        }
    }

    sqlx::query(
        r#"
        UPDATE users
        SET default_shipping_address_id = $1, updated_at = $2
        WHERE id = $3
        RETURNING *
        "#,
    )
    .bind(address_id)
    .bind(time_now)
    .bind(user_id)
    .fetch_one(tx.as_mut())
    .await?;

    Ok(())
}