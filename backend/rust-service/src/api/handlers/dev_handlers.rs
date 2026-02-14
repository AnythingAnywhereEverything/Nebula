use axum::{Json, extract::State, response::IntoResponse};
use serde_json::json;

use crate::{
    api::{APIError},
    application::state::SharedState,
};

// health handler for development/testing purposes
pub async fn health_handler(
    State(state): State<SharedState>,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("state config: {:#?}", state.config);
    // Sending status json response
    Ok(Json(json!({
        "status": "ok",
    })))
}

