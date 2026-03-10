use serde::{Deserialize, Serialize};
use sqlx::{Decode, FromRow, types::Json};

use rust_decimal::Decimal;
use std::collections::HashMap;

use crate::domain::models::product::ReturnProductSpecification;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]
pub struct TypingQueryProduct {
    pub id: String,
    pub name : String,
    pub shop_id: String
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]
pub struct QueryProductData {
    pub id: String,
    pub name : String,
    pub rating : String,

    // * Use first image available from product_images
    pub product_image : String,

    // * Using first variant data from product_variants

    pub price: String,
    pub on_sale: bool,
    pub sale_price: Option<String>
}

#[derive(Serialize, Deserialize)]
pub struct SearchProductResponse {
    pub data: Vec<QueryProductData>,
    pub page: i64,
    pub total_pages: i64,
}

#[derive(Debug, FromRow, Deserialize, Serialize, Decode)]
pub struct ProductPageVariant {
    pub id: String,
    pub price: Decimal,
    pub sale_price: Option<Decimal>,
    pub on_sale: bool,
    pub stock: String,

    pub images: Vec<String>,

    pub attributes: Json<HashMap<String, String>>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ProductOption {
    pub name: String,
    pub values: Vec<String>,
}


#[derive(Debug, FromRow, Decode)]
pub struct ProductRow {
    pub id: String,
    pub store_name: String,
    pub store_id: String,

    pub free_shipping: bool,
    pub name: String,
    pub description: String,

    pub rating: String,
    pub review_amount: String,
    pub sold: String,
    pub has_variants: bool
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct ProductDto {
    pub id: String,
    pub store_name: String,
    pub store_id: String,

    // * product information
    pub free_shipping: bool,
    pub name: String,
    pub description: String,
    pub has_variants: bool,

    pub rating: String,
    pub review_amount: String,
    pub sold: String,

    pub specification: Vec<ReturnProductSpecification>,

    pub options: Option<Vec<ProductOption>>,

    pub variants: Vec<ProductPageVariant>,
}

impl From<ProductRow> for ProductDto {
    fn from(row: ProductRow) -> Self {
        Self {
            id: row.id,
            store_name: row.store_name,
            store_id: row.store_id,
            free_shipping: row.free_shipping,
            has_variants: row.has_variants,
            name: row.name,
            description: row.description,
            rating: row.rating,
            review_amount: row.review_amount,
            sold: row.sold,
            specification: vec![],
            options: None,
            variants: vec![],
        }
    }
}