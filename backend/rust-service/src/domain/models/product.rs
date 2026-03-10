use std::collections::HashMap;
use rust_decimal::Decimal;
use serde_aux::prelude::*;

use chrono::NaiveDateTime;
use serde::{Deserialize, Deserializer, Serialize};
use serde_json::Value;
use sqlx::FromRow;

#[derive(Debug, Serialize, FromRow)]
pub struct GetProductEdit {
    pub product: EditProductRow,
    pub attributes: Vec<EditAttributeRow>,
    pub attribute_options: Vec<EditAttributeOptionRow>,
    pub variant_values: Vec<EditVariantValueRow>,
    pub variants: Vec<EditVariantRow>,
    pub specifications: Vec<ReturnProductSpecification>,
    pub product_images: Vec<ProductImageRow>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct GetVariantEdit {
    pub variant: EditVariantRow,
    pub variant_images: Vec<ProductImageRow>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct EditProductRow {
    pub id: String,
    pub shop_id: String,
    pub name: String,
    pub description: String,
    pub has_variants: bool,
    pub is_active: bool,
    pub free_shipping: bool,
    pub deleted_at: Option<NaiveDateTime>,}

#[derive(Debug, Serialize, FromRow)]
pub struct ProductImageRow {
    pub id: String,
    pub product_id: Option<String>,
    pub variant_id: Option<String>,
    pub image_url: String,
    pub position: i32,
}

#[derive(Debug, Serialize, FromRow)]
pub struct EditAttributeRow {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Serialize, FromRow)]
pub struct EditAttributeOptionRow {
    pub id: String,
    pub attribute_id: String,
    pub value: String,
}

#[derive(Debug, Serialize, FromRow)]
pub struct EditVariantValueRow {
    pub variant_id: String,
    pub attribute_option_id: String,
}

#[derive(Debug, Serialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct EditVariantRow {
    pub id: String,
    pub sku: String,
    pub price: String,
    pub sale_price: Option<String>,
    pub cost: String,
    pub on_sale: bool,
    pub stock: String,
    pub barcode: Option<String>,
    pub is_enabled: bool,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ReturnProductSpecification {
    pub id: String,
    pub key: String,
    pub value: String,
}

#[derive(Serialize, FromRow)]
pub struct GetShopProduct {
    pub id: String,

    pub name: String,
    pub description: String,

    pub has_variants: bool,
    pub is_active: bool,
    pub free_shipping: bool,

    pub image_url: Option<String>,

    pub variant_count: i64,
    pub total_stock: i64,

    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
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

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ProductVariant {
    pub id: i64,

    pub shop_id: i64,
    pub product_id: i64,

    pub price: i64,
    pub cost: i64,

    pub on_sale: bool,
    pub sale_price: Option<i64>,

    pub sku: String,
    pub stock: String,
    pub barcode: Option<String>,
    pub is_enabled: bool,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct ProductSpecification {
    pub id: i64,
    pub key: String,
    pub value: String,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct ProductImages {
    pub id: i64,
    pub product_id: Option<i64>,
    pub variant_id: Option<i64>,
    pub image_url: String,
    pub position: i32,
}

// * deserializer :sob:

pub fn deserialize_decimal<'de, D>(
    deserializer: D
) -> Result<Decimal, D::Error>
where
    D: Deserializer<'de>,
{
    let value = Value::deserialize(deserializer)?;

    match value {
        Value::String(s) => s.parse::<Decimal>().map_err(serde::de::Error::custom),
        Value::Number(n) => n.to_string().parse::<Decimal>().map_err(serde::de::Error::custom),
        _ => Err(serde::de::Error::custom("invalid decimal")),
    }
}

pub fn deserialize_option_decimal<'de, D>(
    deserializer: D
) -> Result<Option<Decimal>, D::Error>
where
    D: Deserializer<'de>,
{
    let value = Option::<Value>::deserialize(deserializer)?;

    match value {
        None => Ok(None),

        Some(Value::String(s)) => {
            if s.trim().is_empty() {
                Ok(None)
            } else {
                s.parse::<Decimal>()
                    .map(Some)
                    .map_err(serde::de::Error::custom)
            }
        }

        Some(Value::Number(n)) => {
            n.to_string()
                .parse::<Decimal>()
                .map(Some)
                .map_err(serde::de::Error::custom)
        }

        _ => Err(serde::de::Error::custom("invalid decimal value")),
    }
}

pub fn deserialize_vec_i64_from_string_vec<'de, D>(
    deserializer: D
) -> Result<Vec<i64>, D::Error>
where
    D: Deserializer<'de>,
{
    let v: Vec<String> = Vec::deserialize(deserializer)?;
    v.into_iter()
        .map(|s| s.parse::<i64>().map_err(serde::de::Error::custom))
        .collect()
}

// * DTOs below sir

#[derive(Debug, Deserialize)]
pub struct UpdateProductSettings {
    pub active: bool,
    pub free_shipping: bool,
}

#[derive(Debug, Deserialize)]
pub struct UpdateVariantDto {
    pub sku: String,

    #[serde(deserialize_with = "deserialize_decimal")]
    pub price: Decimal,

    #[serde(default, deserialize_with = "deserialize_option_decimal")]
    pub sale_price: Option<Decimal>,

    #[serde(deserialize_with = "deserialize_decimal")]
    pub cost: Decimal,

    pub on_sale: bool,

    #[serde(deserialize_with = "deserialize_number_from_string")]
    pub stock: i32,

    #[serde(default)]
    pub barcode: Option<String>,

    pub images: Vec<UpdateProductImage>
}


#[derive(Debug, Deserialize)]
pub struct CreateNewVariantDto {
    #[serde(deserialize_with = "deserialize_vec_i64_from_string_vec")]
    pub attribute_options: Vec<i64>,

    pub sku: String,

    #[serde(deserialize_with = "deserialize_decimal")]
    pub price: Decimal,

    #[serde(default, deserialize_with = "deserialize_option_decimal")]
    pub sale_price: Option<Decimal>,

    #[serde(deserialize_with = "deserialize_decimal")]
    pub cost: Decimal,

    pub on_sale: bool,

    #[serde(deserialize_with = "deserialize_number_from_string")]
    pub stock: i32,

    #[serde(default)]
    pub barcode: Option<String>,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct UpdateProductImage {
    #[serde(deserialize_with = "serde_aux::field_attributes::deserialize_option_number_from_string")]
    pub id: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProductInfoDto {
    pub name: String,
    pub description: String,
    pub specifications: Vec<CreateSpecificationDto>,
    pub images: Vec<UpdateProductImage>
}


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
    #[serde(deserialize_with = "deserialize_decimal")]
    pub price: Decimal,
    #[serde(deserialize_with = "deserialize_option_decimal")]
    pub sale_price: Option<Decimal>,
    #[serde(deserialize_with = "deserialize_decimal")]
    pub cost: Decimal,
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