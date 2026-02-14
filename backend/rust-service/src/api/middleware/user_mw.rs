// src/api/middleware/auth.rs

use axum::{
    extract::State,
    http::{Request},
    middleware::Next,
    response::Response,
};
use axum::body::Body;

use crate::{api::APIError, application::{repository::session_repo::validate_session, security::session, state::SharedState}};

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

    let parsed = session::parse(token)?;

    let mut tx = state.db_pool.begin().await?;

    validate_session(
        &mut tx,
        &state.redis,
        parsed.user_id,
        parsed.created_time,
        60 * 60,
    )
    .await?;

    req.extensions_mut().insert(AuthUser {
        user_id: parsed.user_id,
    });

    Ok(next.run(req).await)
}