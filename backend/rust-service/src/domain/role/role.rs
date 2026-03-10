use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Clone)]
pub struct Role {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub permissions: i64,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub is_superuser: bool,
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]

pub struct ShopRole {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub permissions: i64,
}
#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]
pub struct CreateShopRole {
    pub name: String,
    pub description: Option<String>,
    pub permissions: i64,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone, Default, FromRow)]
pub struct ShopRoleResponse {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub permissions: i64,
}

impl From<ShopRole> for ShopRoleResponse {
    fn from(role: ShopRole) -> Self {
        Self {
            id: role.id.to_string(),
            name: role.name,
            description: role.description,
            permissions: role.permissions,
        }
    }
}