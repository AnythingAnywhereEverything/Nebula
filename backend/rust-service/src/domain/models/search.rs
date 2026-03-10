use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone,Default)]
pub struct TypingQueryProduct {
    id: String,
    name : String,
    shop_id: String
}