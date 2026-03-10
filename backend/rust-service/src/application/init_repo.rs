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

pub async fn init_superuser(pool: &sqlx::PgPool) -> Result<(), Box<dyn std::error::Error>> {
    let first_user = find_first_user(pool).await?.expect("no user found");
    let permission = role_repo::get_superuser_id(pool, "SUPER_ADMIN").await;
    tracing::debug!("First user: {:?}", first_user.id);
    tracing::debug!("Is superuser found ?: {:?}", permission);
    let role_id = permission?;

    let is_exist = role_repo::is_superuser_exist(pool, role_id.clone()).await?;
    tracing::debug!("Is exist: {}", is_exist);
    if !is_exist {
        let _ = role_repo::set_superadmin(pool, first_user.id, role_id).await;
    }
    Ok(())
}