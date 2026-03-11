use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Deserialize)]
pub struct ReviewPageQuery {
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct ProductReviewPage {
    pub reviews: Vec<ProductReviewRow>,
    pub page: i64,
    pub has_more: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateNewReview {
    pub rating: i32,
    pub content: String
}

#[derive(Debug, Deserialize)]
pub struct CreateReply {
    pub content: String
}

#[derive(Debug, FromRow, Serialize)]
pub struct ProductReviewRow {
    pub id: String,
    pub user_id: Option<String>,
    pub display_name: Option<String>,
    pub profile_picture_url: Option<String>,

    pub rating: Option<i32>,
    pub content: String,

    pub likes: i32,
    pub dislikes: i32,

    pub user_reaction: Option<String>,

    pub replies_count: i64,

    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Deserialize)]
pub struct PaginationQuery {
    pub page: i64,
}

#[derive(Deserialize)]
pub struct ReviewReactionPayload {
    pub reaction: String
}

#[derive(Debug, FromRow, Serialize)]
pub struct ProductReplyRow {
    pub id: String,
    pub user_id: Option<String>,
    pub profile_picture_url: Option<String>,
    pub display_name: String,
    pub likes: i32,
    pub dislikes: i32,
    pub content: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
    pub user_reaction: Option<String>,
}