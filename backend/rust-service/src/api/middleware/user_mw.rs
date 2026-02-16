use axum::body::Body;
use axum::{extract::State, http::Request, middleware::Next, response::Response};

use crate::{
    api::APIError,
    application::{
        service::{errors::SessionServiceError, session_service::SessionService},
        state::SharedState,
    },
    domain::session::token::SessionToken,
};

#[derive(Clone, Debug)]
pub struct AuthUser {
    pub user_id: i64,
}

pub async fn validate_user(
    State(state): State<SharedState>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, APIError> {
    let token = req
        .headers()
        .get("token")
        .and_then(|t| t.to_str().ok())
        .unwrap_or("");

    let parsed = SessionToken::parse(token).map_err(SessionServiceError::from)?;

    SessionService::validate_session(&state, parsed.user_id, parsed.timestamp, 60 * 60, 60 * 60)
        .await?;

    req.extensions_mut().insert(AuthUser {
        user_id: parsed.user_id,
    });

    Ok(next.run(req).await)
}
