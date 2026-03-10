
use axum::{Json, extract::{Path, Query, State}, response::IntoResponse};
use serde::Deserialize;
use serde_json::json;

use crate::{api::{APIError, APIVersion, version}, application::{repository::search_repo, state::SharedState}};




#[derive(Deserialize, Debug)]
pub struct SearchQuery {
    pub q: String
}

pub async fn type_search_handler(
    State(state): State<SharedState>,
    Path(version): Path<String>,
    Query(params): Query<SearchQuery>
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    
    let mut tx = state.db_pool.begin().await?;

    let result = search_repo::query_product_names(&mut tx, params.q).await?;

    Ok(Json(json!(result)))
}
