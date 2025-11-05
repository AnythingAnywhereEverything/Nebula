use crate::application::security;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct User {
    pub id: i64,
    pub display_name: String,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub active: bool,
    pub roles: String,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

impl User {
    pub fn is_admin(&self) -> bool {
        security::roles::contains_role_admin(&self.roles)
    }
}
