use sqlx::{Postgres, Transaction};

use crate::domain::models::oauth_account::OAuthAccount;

pub async fn get_by_provider(
    tx: &mut Transaction<'_, Postgres>,
    provider: &str,
    provider_user_id: &str,
) -> Result<Option<OAuthAccount>, sqlx::Error> {
    sqlx::query_as::<_, OAuthAccount>(
        r#"
        SELECT *
        FROM oauth_accounts
        WHERE provider = $1
          AND provider_user_id = $2
        "#,
    )
    .bind(provider)
    .bind(provider_user_id)
    .fetch_optional(tx.as_mut())
    .await
}

pub async fn get_user_id_by_provider(
    tx: &mut Transaction<'_, Postgres>,
    provider: &str,
    provider_user_id: &str,
) -> Result<Option<i64>, sqlx::Error> {
    sqlx::query_scalar::<_, i64>(
        r#"
        SELECT user_id
        FROM oauth_accounts
        WHERE provider = $1
          AND provider_user_id = $2
        "#,
    )
    .bind(provider)
    .bind(provider_user_id)
    .fetch_optional(tx.as_mut())
    .await
}

pub async fn insert(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    user_id: i64,
    provider: &str,
    provider_user_id: &str,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO oauth_accounts
        (id, user_id, provider, provider_user_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        "#,
    )
    .bind(id)
    .bind(user_id)
    .bind(provider)
    .bind(provider_user_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}
