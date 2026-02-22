use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct User {
    pub id: i64,
    pub display_name: String,
    pub username: String,

    pub email: String,
    pub email_verified: bool,

    pub profile_picture_url: Option<String>,
    pub password_hash: Option<String>,
    
    pub is_active: bool,

    pub last_login: Option<NaiveDateTime>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct NewUser {
    pub id: i64,
    pub display_name: String,
    pub username: String,
    pub email: String,
    pub password_hash: Option<String>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone, Default)]
pub struct UserUpdate {
    pub display_name: Option<String>,
    pub username: Option<String>,
    pub email: Option<String>,
    pub email_verified: Option<bool>,
    pub password_hash: Option<String>,

    pub profile_picture_url: Option<String>,

    pub is_active: Option<bool>,

}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct UserResponse {
    pub id: String,
    pub username: String,
    pub display_name: Option<String>,
    pub email: Option<String>,
    pub email_verified: bool,
    pub active: bool,
    pub created_at: Option<NaiveDateTime>,
    pub profile_picture_url: Option<String>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id.to_string(),
            username: user.username,
            display_name: Some(user.display_name),
            email: Some(user.email),
            email_verified: user.email_verified,
            active: user.is_active,
            created_at: user.created_at,
            profile_picture_url: user.profile_picture_url
        }
    }
}