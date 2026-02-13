use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct OAuthAccount {
    pub id: i64,
    pub user_id: i64,
    pub provider: String,
    pub provider_user_id: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Deserialize)]
pub struct GoogleUserInfo {
    pub sub: String,
    pub email: String,
    pub email_verified: bool,
    pub given_name: Option<String>,
    pub family_name: Option<String>,
    pub name: Option<String>,
}
