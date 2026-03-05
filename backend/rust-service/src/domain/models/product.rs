use std::collections::HashMap;

use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct ProductInfo {
    pub id: i64,
    pub shop_id: i64,
    pub name: String,
    pub description: String,

    pub has_variants: bool,
    pub is_active: bool,
    pub free_shipping: bool,

    pub deleted_at: Option<NaiveDateTime>,
}

// * DTOs below sir

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProductDto {
    pub name: String,
    pub description: String,
    pub is_active: bool,
    pub free_shipping: bool,
    pub has_variant: bool,
    pub attributes: Vec<CreateAttributesDto>,
    pub variants: Vec<CreateVariantDto>,
    pub specifications: Vec<CreateSpecificationDto>,
}


#[derive(Debug, Deserialize)]
pub struct CreateAttributesDto {
    pub id: String,
    pub name: String,
    pub options: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateVariantDto {
    pub id: String,
    pub values: HashMap<String, String>,
    pub is_enabled: bool,
    pub sku: String,
    pub price: String,
    pub sale_price: Option<String>,
    pub cost: String,
    pub on_sale: bool,
    pub stock: String,
    pub barcode: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateSpecificationDto {
    pub id: String,
    pub key: String,
    pub value: String,
}