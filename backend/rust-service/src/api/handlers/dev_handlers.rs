use axum::{
    Json,
    extract::{Path, State},
    response::IntoResponse,
};
use serde_json::json;

use crate::{
    api::{
        APIError,
        version::{self, APIVersion},
    },
    application::state::SharedState,
};

// health handler for development/testing purposes
pub async fn health_handler(
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    tracing::trace!("id: {}", id);
    tracing::trace!("state config: {:#?}", state.config);
    // Sending status json response
    Ok(Json(json!({
        "status": "ok",
    })))
}
