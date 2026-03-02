use axum::{
    Json,
    extract::{ Path, State},
    response::IntoResponse, // response::IntoResponse,
};
use chrono::NaiveDateTime;
use serde::Deserialize;

use crate::{
    api::{
        APIError,
        version::{self, APIVersion},
    },
    application::{
        service::session_service::SessionService,
        state::SharedState,
    },
};

#[derive(serde::Serialize)]
pub struct SessionResponse {
    pub id: String,
    pub created_at: NaiveDateTime,
    pub agent: String,
}

#[derive(Deserialize)]
pub struct DeleteSessionRequest{
    pub session_id: String,
    pub user_id: String
}

pub async fn get_all_session_handler(
    Path((version,user_id)): Path<(String, i64)>,
    State(state): State<SharedState>,
)  -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let sessions = SessionService::get_all_sessions_by_user_id( &state, user_id).await?;
    let response: Vec<SessionResponse> = sessions
    .into_iter()
    .map(|s| SessionResponse {
        id: s.id.to_string(),
        created_at: s.created_at,
        agent: s.agent,
    })
    .collect();
    Ok(Json(response))
}

pub async fn delete_session_user_handler(
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    Json(payload): Json<DeleteSessionRequest>,
)   -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    SessionService::delete_session_user(&state, payload.session_id, id).await?;
    Ok(())
}