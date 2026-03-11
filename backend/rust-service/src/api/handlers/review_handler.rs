use axum::{Extension, Json, extract::{Path, Query, Request, State}, response::IntoResponse};
use serde_json::json;

use crate::{api::{APIError, APIVersion, middleware::user_mw::AuthUser, version}, application::{repository::review_repo::{self}, service::session_service::SessionService, state::SharedState}, domain::{models::review::{CreateNewReview, CreateReply, PaginationQuery, ProductReviewPage, ReviewPageQuery, ReviewReactionPayload}, session::session_token::SessionToken}};



pub async fn create_review_handler(
    Extension(auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, product_id)): Path<(String, i64)>,
    Json(payload): Json<CreateNewReview>
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let id = state.snowflake_generator.generate_id()?;

    let rating = payload.rating.clamp(1, 5);

    let result = review_repo::create_product_review(
        &mut tx,
        auth.user_id,
        id,
        product_id,
        payload.content,
        rating
    ).await?;

    review_repo::update_product_review(&mut tx, product_id, rating).await?;

    review_repo::update_shop_review(&mut tx, product_id, rating).await?;

    tx.commit().await?;

    Ok(Json(result))
}

pub async fn get_product_reviews_handler(
    State(state): State<SharedState>,
    Path((version, product_id)): Path<(String, i64)>,
    Query(params): Query<ReviewPageQuery>,
    req: Request
) -> Result<impl IntoResponse, APIError> {
    // * manual intervention
    let user_id: Option<i64> = {
        let token = req
            .headers()
            .get("token")
            .and_then(|t| t.to_str().ok());
        if let Some(token) = token {
            if let Ok(parsed) = SessionToken::parse(token) {
                if SessionService::validate_session(
                    &state,
                    parsed.user_id,
                    parsed.timestamp,
                    60 * 60,
                    60 * 60,
                )
                .await
                .is_ok()
                {
                    Some(parsed.user_id)
                } else {
                    None
                }
            } else {
                None
            }
        } else {
            None
        }
    };


    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let page: i64 = params.page.unwrap_or(0).max(0);
    let limit: i64 = params.limit.unwrap_or(20).min(50).max(5);

    let offset = page * limit;

    let mut tx = state.db_pool.begin().await?;

    let (reviews, has_more) = review_repo::query_product_reviews(
        &mut tx,
        product_id,
        limit,
        offset,
        user_id
    ).await?;

    tx.commit().await?;

    Ok(Json(ProductReviewPage {
        reviews,
        page,
        has_more
    }))
}

pub async fn react_review_handler(
    Extension(auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, review_id)): Path<(String, i64)>,
    Json(payload): Json<ReviewReactionPayload>
) -> Result<impl IntoResponse, APIError> {

    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let reaction = match payload.reaction.as_str() {
        "like" => "like",
        "dislike" => "dislike",
        _ => "none",
    };

    let mut tx = state.db_pool.begin().await?;

    let id = state.snowflake_generator.generate_id()?;

    review_repo::react_to_review(
        &mut tx,
        id,
        auth.user_id,
        review_id,
        reaction
    ).await?;

    tx.commit().await?;

    Ok(())
}

pub async fn create_review_reply_handler(
    Extension(auth): Extension<AuthUser>,
    State(state): State<SharedState>,
    Path((version, product_id, review_id)): Path<(String, i64, i64)>,
    Json(payload): Json<CreateReply>,
) -> Result<impl IntoResponse, APIError> {


    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let id = state.snowflake_generator.generate_id()?;

    let result = review_repo::create_review_reply(
        &mut tx,
        id,
        review_id,
        auth.user_id,
        product_id,
        payload.content
    ).await?;

    tx.commit().await?;

    Ok(Json(result))
}

pub async fn query_review_replies_handler(
    State(state): State<SharedState>,
    Path((version, _product_id, review_id)): Path<(String, i64, i64)>,
    Query(query): Query<PaginationQuery>,
    req: Request
) -> Result<impl IntoResponse, APIError> {
    let user_id: Option<i64> = {
        let token = req
            .headers()
            .get("token")
            .and_then(|t| t.to_str().ok());
        if let Some(token) = token {
            if let Ok(parsed) = SessionToken::parse(token) {
                if SessionService::validate_session(
                    &state,
                    parsed.user_id,
                    parsed.timestamp,
                    60 * 60,
                    60 * 60,
                )
                .await
                .is_ok()
                {
                    Some(parsed.user_id)
                } else {
                    None
                }
            } else {
                None
            }
        } else {
            None
        }
    };


    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let limit = 10;
    let offset = query.page * limit;

    let mut tx = state.db_pool.begin().await?;

    let (replies, has_more) = review_repo::query_review_replies(
        &mut tx,
        review_id,
        user_id,
        limit,
        offset
    ).await?;

    tx.commit().await?;

    Ok(Json(json!({
        "replies": replies,
        "has_more": has_more
    })))
}