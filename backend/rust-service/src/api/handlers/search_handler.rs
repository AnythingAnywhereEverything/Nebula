use axum::{
    Json,
    extract::{Path, Query, State},
    response::IntoResponse,
};
use redis::AsyncCommands;
use rust_decimal::Decimal;
use serde::Deserialize;

use crate::{
    api::{APIError, APIVersion, version},
    application::{
        repository::{product_repo, search_repo},
        state::SharedState,
    },
    domain::models::search::{ProductDto, SearchProductResponse, TypingQueryProduct},
};

#[derive(Deserialize, Debug)]
pub struct SearchQuery {
    pub q: String,
}

#[derive(Deserialize, Debug)]
pub struct SearchPageQuery {
    #[serde(default)]
    pub q: Option<String>,

    #[serde(default)]
    pub page: Option<i64>,

    #[serde(default)]
    pub limit: Option<i64>,

    #[serde(default)]
    pub rating: Option<Decimal>,

    #[serde(default)]
    pub max_price: Option<i64>,

    #[serde(default)]
    pub min_price: Option<i64>,

    #[serde(default)]
    pub shop_id: Option<i64>,
}

pub async fn type_search_handler(
    State(state): State<SharedState>,
    Path(version): Path<String>,
    Query(params): Query<SearchQuery>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let mut conn = state.redis.get().await?;

    let cache_key = format!("search_typing:{}", params.q.to_lowercase());

    if let Some(cached) = conn.get::<_, Option<String>>(&cache_key).await? {
        let data: Vec<TypingQueryProduct> = serde_json::from_str(&cached)?;
        return Ok(Json(data));
    }

    let result = search_repo::query_product_names(&mut tx, params.q).await?;

    let serialized = serde_json::to_string(&result)?;
    let _: () = conn.set_ex(cache_key, serialized, 10).await?;

    Ok(Json(result))
}

pub async fn search_product_handler(
    State(state): State<SharedState>,
    Path(version): Path<String>,
    Query(params): Query<SearchPageQuery>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let page = params.page.unwrap_or(0).max(0);

    let limit: i64 = params.limit.unwrap_or(50).max(5).min(100);
    let offset = page * limit;

    let mut tx = state.db_pool.begin().await?;

    let mut conn = state.redis.get().await?;

    let cache_key = format!(
        "search:{}:{}:{}:{:?}:{:?}:{:?}:{:?}",
        params.q.clone().unwrap_or_default().to_lowercase(),
        page,
        limit,
        params.rating,
        params.min_price,
        params.max_price,
        params.shop_id
    );

    if let Some(cached) = conn.get::<_, Option<String>>(&cache_key).await? {
        let data: SearchProductResponse = serde_json::from_str(&cached)?;
        return Ok(Json(data));
    }

    let total_items = search_repo::count_search_products(
        &mut tx,
        params.q.clone(),
        params.rating,
        params.min_price,
        params.max_price,
        params.shop_id,
    )
    .await?;

    let total_pages = (total_items as f64 / limit as f64).ceil() as i64;

    let result = search_repo::query_product_datas(
        &mut tx,
        params.q,
        offset,
        limit,
        params.rating,
        params.min_price,
        params.max_price,
        params.shop_id,
    )
    .await?;

    let response = SearchProductResponse {
        data: result,
        page,
        total_pages,
    };

    let serialized = serde_json::to_string(&response)?;
    let _: () = conn.set_ex(cache_key, serialized, 10).await?;

    Ok(Json(response))
}

pub async fn get_product_page_handler(
    State(state): State<SharedState>,
    Path((version, variant_id)): Path<(String, i64)>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    // * resolve product_id from variant
    let product_id = product_repo::get_product_id_from_variant(&mut tx, variant_id).await?;

    // * fetch product row
    let product_row = search_repo::query_product(&mut tx, product_id).await?;

    // * map row → dto
    let mut product: ProductDto = product_row.into();

    // * attach options
    let options = search_repo::query_product_options(&mut tx, product_id).await?;

    product.options = Some(options);

    // * attach variants
    let variants = search_repo::query_product_variants(&mut tx, product_id).await?;

    product.variants = variants;

    let specification = search_repo::query_product_specification(&mut tx, product_id).await?;

    product.specification = specification;

    tx.commit().await?;

    Ok(Json(product))
}
