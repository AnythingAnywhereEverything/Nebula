use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct User {
    pub id: i64,
    pub display_name: String,
    pub username: String,
    pub email: String,
    
    pub profile_picture_url: Option<String>,
    pub phone_number: Option<String>,
    pub password_hash: Option<String>,
    
    pub is_active: bool,

    pub date_of_birth: Option<NaiveDateTime>,
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
    pub phone_number: Option<String>,
    pub password_hash: Option<String>,

    pub profile_picture_url: Option<String>,

    pub is_active: Option<bool>,

    pub date_of_birth: Option<NaiveDateTime>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct UserResponse {
    pub id: String,
    pub username: String,
    pub display_name: Option<String>,
    pub email: Option<String>,
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
            active: user.is_active,
            created_at: user.created_at,
            profile_picture_url: user.profile_picture_url
        }
    }
}