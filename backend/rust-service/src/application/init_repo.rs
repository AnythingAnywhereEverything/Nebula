use crate::{application::{repository::{errors::UserRepoError, role_repo}, service::snowflake_service::{SnowflakeGenerator, SnowflakeKind}}, domain::{models::user::UserRole, role::permission::PermissionsSet}};

pub async fn init_roles(pool: &sqlx::PgPool) -> Result<(), Box<dyn std::error::Error>> {

    let snowflake = SnowflakeGenerator::new(1, SnowflakeKind::Api)?;

    role_repo::insert_if_missing(
        pool,
        &snowflake,
        "SUPER_ADMIN",
        "System administrator",
        PermissionsSet::SUPER_ADMIN as i64,
        true,
    ).await?;

    role_repo::insert_if_missing(
        pool,
        &snowflake,
        "VERIFIED_USER",
        "User can create shop",
        PermissionsSet::CREATE_SHOP as i64,
        false,
    ).await?;
    

    role_repo::insert_if_missing(
        pool,
        &snowflake,
        "USER",
        "Default user role",
        PermissionsSet::USER as i64,
        false,
    ).await?;

    Ok(())
}

pub async fn find_first_user(
    pool: &sqlx::PgPool,
) -> Result<Option<UserRole>, UserRepoError> {
    let first_user = sqlx::query_as::<_, UserRole>(
        r#"
        SELECT * FROM users
        ORDER BY created_at
        LIMIT 1;
        "#
    )
    .fetch_optional(pool)
    .await
    .map_err(|err| {
        tracing::error!("Database error: {:?}", err);
        UserRepoError::UserNotFound
    })?;

    Ok(first_user.into())
}