use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct NewShop {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub is_brand: bool,
    pub owner_id: i64,
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct AssociateShops {
    pub owned: Vec<ShopResponse>,
    pub associate: Vec<ShopResponse>
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]
pub struct Shop {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub owner_id: i64,
    pub is_brand: bool,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub shop_profile_url: Option<String>,
    pub shop_banner_url: Option<String>,
}

pub struct ShopMember {
    pub shop_id: i64,
    pub user_id: i64,
    pub role: String,
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]
pub struct ShopResponse {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub owner_id: String,
    pub is_brand: bool,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub shop_profile_url: Option<String>,
    pub shop_banner_url: Option<String>,
}
#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]

pub struct ShopUpdateData{
    pub name: String,
    pub description: Option<String>,
}
#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]
pub struct ShopUpdateProfile{
    pub shop_profile_url: Option<String>,
}
#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]
pub struct ShopUpdateBanner{
    pub shop_banner_url: Option<String>,
}

impl From<Shop> for ShopResponse {
    fn from(shop: Shop) -> Self {
        Self {
            id: shop.id.to_string(),
            name: shop.name,
            description: shop.description,
            owner_id: shop.owner_id.to_string(),
            is_brand: shop.is_brand,
            created_at: shop.created_at,
            updated_at: shop.updated_at,
            shop_profile_url: shop.shop_profile_url,
            shop_banner_url: shop.shop_banner_url,
        }
    }
}

