use serde::{Deserialize, Serialize};
use sqlx::{FromRow};

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct CheckMarkToCart {
    #[serde(deserialize_with = "serde_aux::field_attributes::deserialize_number_from_string")]
    pub product_id: String,
    #[serde(deserialize_with = "serde_aux::field_attributes::deserialize_option_number_from_string")]
    pub product_variants_id: Option<String>,
    pub is_selected: bool,
}