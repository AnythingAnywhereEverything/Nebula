use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct User {
    pub id: i64,
    pub display_name: String,
    pub username: String,
    pub email: String,
    pub password_hash: Option<String>,
    pub active: bool,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}