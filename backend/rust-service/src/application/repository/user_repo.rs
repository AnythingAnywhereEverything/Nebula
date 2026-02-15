use chrono::Utc;
use hyper::StatusCode;
use sqlx::{QueryBuilder, Transaction, query_as};
use thiserror::Error;
use uuid::Uuid;
use sqlx::Postgres;

use crate::{
    api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind}, application::{repository::RepositoryResult, state::SharedState}, domain::models::user::{NewUser, User, UserUpdate}
};

/// List users with pagination
pub async fn list(state: &SharedState, limit: i64, offset: i64) -> RepositoryResult<Vec<User>> {
    let users = query_as::<_, User>("SELECT * FROM users LIMIT $1 OFFSET $2")
        .bind(limit)
        .bind(offset)
        .fetch_all(&state.db_pool)
        .await?;
    Ok(users)
}

/// Add a new user, return the created user with id
pub async fn add(
    tx: &mut Transaction<'_, Postgres>,
    user: NewUser
) -> RepositoryResult<User> {
    tracing::trace!("user: {:#?}", user);
    let time_now = Utc::now().naive_utc();

    let user = sqlx::query_as::<_, User>(
        r#"INSERT INTO users (id,
         display_name,
         username,
         email,
         password_hash,
         is_active,
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
    .fetch_one(tx.as_mut())
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

pub async fn get_by_id(
    tx: &mut Transaction<'_, Postgres>,
    id: i64) -> RepositoryResult<User> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(id)
        .fetch_one(tx.as_mut())
        .await?;
    Ok(user)
}

/// Get user by username or email, return error if not found
/// Will be replaced 
pub async fn get_by_username_or_email(
    tx: &mut Transaction<'_, Postgres>,
    username_or_email: &str
) -> RepositoryResult<User> {
    let user: User = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = $1 OR email = $2")
        .bind(username_or_email)
        .bind(username_or_email)
        .fetch_one(tx.as_mut())
        .await?;
    Ok(user)
}

pub async fn update(
    tx: &mut Transaction<'_, Postgres>,
    user: UserUpdate,
    target_user_id: i64,
) -> RepositoryResult<User> {
    tracing::trace!("user: {:#?}", user);
    let time_now = Utc::now().naive_utc();

    let mut qb = QueryBuilder::<Postgres>::new(
        "UPDATE users SET "
    );

    let mut first = true;

    macro_rules! push_field {
        ($opt:expr, $name:expr) => {
            if let Some(value) = $opt {
                if !first {
                    qb.push(", ");
                }
                qb.push($name);
                qb.push(" = ");
                qb.push_bind(value);
                first = false;
            }
        };
    }

    push_field!(user.display_name, "display_name");
    push_field!(user.username, "username");
    push_field!(user.email, "email");
    push_field!(user.phone_number, "phone_number");
    push_field!(user.password_hash, "password_hash");
    push_field!(user.profile_picture_url, "profile_picture_url");
    push_field!(user.is_active, "is_active");
    push_field!(user.date_of_birth, "date_of_birth");

    // Always update updated_at
    if !first {
        qb.push(", ");
    }
    qb.push("updated_at = ");
    qb.push_bind(time_now);

    qb.push(" WHERE id = ");
    qb.push_bind(target_user_id);

    qb.push(" RETURNING *");

    let user = qb
        .build_query_as::<User>()
        .fetch_one(tx.as_mut())
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

#[derive(Debug, Error)]
pub enum UserRepoError {
    #[error("Internal server error.")]
    UserInternalServerError,
    #[error("Username {0} is already taken.")]
    UsernameAlreadyTaken(String)
}

impl From<UserRepoError> for APIError {
    fn from(user_repo_error: UserRepoError) -> Self {
        let (status_code, code) = match user_repo_error {
            UserRepoError::UsernameAlreadyTaken(_) => (
                StatusCode::CONFLICT,
                APIErrorCode::UsernameAlreadyTaken,
            ),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorCode::SystemError
            )
        };

        let error = APIErrorEntry::new(&user_repo_error.to_string())
            .code(code)
            .kind(APIErrorKind::UserProfileError);

        Self {
            status: status_code.as_u16(),
            errors: vec![error],
        }
    }
}