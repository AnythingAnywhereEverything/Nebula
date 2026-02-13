use chrono::Utc;
use sqlx::{Transaction, query_as};
use uuid::Uuid;
use sqlx::{Executor, Postgres};

use crate::{
    application::{repository::RepositoryResult, state::SharedState},
    domain::models::user::User,
};

pub async fn list(state: &SharedState) -> RepositoryResult<Vec<User>> {
    let users = query_as::<_, User>("SELECT * FROM users")
        .fetch_all(&state.db_pool)
        .await?;

    Ok(users)
}

pub async fn add(user: User, state: &SharedState) -> RepositoryResult<User> {
    let time_now = Utc::now().naive_utc();
    tracing::trace!("user: {:#?}", user);
    let user = sqlx::query_as::<_, User>(
        r#"INSERT INTO users (id,
         display_name,
         username,
         email,
         password_hash,
         active,
         created_at,
         updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING users.*"#,
    )
    .bind(user.id)
    .bind(user.display_name)
    .bind(user.username)
    .bind(user.email)
    .bind(user.password_hash)
    .bind(true)
    .bind(time_now)
    .bind(time_now)
    .fetch_one(&state.db_pool)
    .await?;

    Ok(user)
}

pub async fn is_exist(username: &str, state: &SharedState) -> RepositoryResult<bool> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE username = $1")
        .bind(username)
        .fetch_one(&state.db_pool)
        .await?;

    Ok(count > 0)
}

pub async fn get_by_id(id: i64, state: &SharedState) -> RepositoryResult<User> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(id)
        .fetch_one(&state.db_pool)
        .await?;
    Ok(user)
}

pub async fn get_by_username_or_email(username_or_email: &str, state: &SharedState) -> RepositoryResult<User> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = $1 OR email = $2")
        .bind(username_or_email)
        .bind(username_or_email)
        .fetch_one(&state.db_pool)
        .await?;

    Ok(user)
}

pub async fn update(user: User, state: &SharedState) -> RepositoryResult<User> {
    tracing::trace!("user: {:#?}", user);
    let time_now = Utc::now().naive_utc();
    let user = sqlx::query_as::<_, User>(
        r#"UPDATE users
         SET 
         username = $1,
         email = $2,
         password_hash = $3,
         active = $5,
         updated_at = $6
         WHERE id = $7
         RETURNING users.*"#,
    )
    .bind(user.username)
    .bind(user.email)
    .bind(user.password_hash)
    .bind(user.active)
    .bind(time_now)
    .bind(user.id)
    .fetch_one(&state.db_pool)
    .await?;

    Ok(user)
}

pub async fn delete(id: Uuid, state: &SharedState) -> RepositoryResult<bool> {
    let query_result = sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(id)
        .execute(&state.db_pool)
        .await?;

    Ok(query_result.rows_affected() == 1)
}


pub async fn get_by_email<'e, E>(
    executor: E,
    email: &str,
) -> Result<Option<i64>, sqlx::Error>
where
    E: Executor<'e, Database = Postgres>,
{
    sqlx::query_scalar::<_, i64>(
        r#"
        SELECT id
        FROM users
        WHERE email = $1
        "#,
    )
    .bind(email)
    .fetch_optional(executor)
    .await
}

pub async fn get_id_by_email(
    tx: &mut Transaction<'_, Postgres>,
    email: &str,
) -> Result<Option<i64>, sqlx::Error>{
    sqlx::query_scalar::<_, i64>(
        r#"
        SELECT id
        FROM users
        WHERE email = $1
        "#,
    )
    .bind(email)
    .fetch_optional(tx.as_mut())
    .await
}

pub async fn insert_oauth_user(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    username: &str,
    display_name: &str,
    email: &str,
) -> Result<(), sqlx::Error>{
    sqlx::query(
        r#"
        INSERT INTO users
        (id, username, display_name, email, password_hash, active, email_verified, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NULL, TRUE, TRUE, NOW(), NOW())
        "#,
    )
    .bind(id)
    .bind(username)
    .bind(display_name)
    .bind(email)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}
