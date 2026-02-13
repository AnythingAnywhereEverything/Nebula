use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
    // response::IntoResponse,
};
// use hyper::HeaderMap;
use thiserror::Error;

use crate::{
    api::{
        APIError, APIErrorCode, APIErrorEntry, APIErrorKind,
        error::API_DOCUMENT_URL,
        version::{self, APIVersion},
    },
    application::{
        repository::{session_repo::validate_session, user_repo},
        security::{session},
        state::SharedState,
    },
    domain::models::user::User,
};

pub async fn get_user_handler(
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    token: String,
) -> Result<Json<User>, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);
    tracing::trace!("authentication details: {:#?}", token);
    tracing::trace!("id: {}", id);

    let token_parsed = session::parse(&token)?;

    validate_session(&state.db_pool, &state.redis, token_parsed.user_id, token_parsed.created_time, 60 * 60).await?;

    let user = user_repo::get_by_id(id, &state)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => {
                let user_error = UserError::UserNotFound(id);
                (user_error.status_code(), APIErrorEntry::from(user_error)).into()
            }
            _ => APIError::from(e),
        })?;

    Ok(Json(user))
}

// pub async fn deactive_user_handler(
//     State(state): State<SharedState>,
//     Path((version, id)): Path<(String, i64)>,
//     headers: HeaderMap,
// ) -> Result<impl IntoResponse, APIError> {
//     Ok("Ok")
// }

#[derive(Debug, Error)]
enum UserError {
    #[error("user not found: {0}")]
    UserNotFound(i64),
}

impl UserError {
    const fn status_code(&self) -> StatusCode {
        match self {
            Self::UserNotFound(_) => StatusCode::NOT_FOUND,
        }
    }
}

impl From<UserError> for APIErrorEntry {
    fn from(user_error: UserError) -> Self {
        let message = user_error.to_string();
        match user_error {
            UserError::UserNotFound(user_id) => Self::new(&message)
                .code(APIErrorCode::UserNotFound)
                .kind(APIErrorKind::ResourceNotFound)
                .description(&format!("user with the ID '{}' does not exist in our records", user_id))
                .detail(serde_json::json!({"user_id": user_id}))
                .reason("must be an existing user")
                .instance(&format!("/api/v1/users/{}", user_id))
                .trace_id()
                .help(&format!("please check if the user ID is correct or refer to our documentation at {}#errors for more information", API_DOCUMENT_URL))
                .doc_url()
        }
    }
}
