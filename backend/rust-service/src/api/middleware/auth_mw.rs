use axum::{
    body::Body,
    extract::{Request, State},
    http::header::USER_AGENT,
    middleware::Next,
    response::Response,
};
use axum_client_ip::ClientIp;

use crate::{api::APIError, application::state::SharedState};

#[derive(Clone, Debug)]
pub struct AuthHeader {
    pub user_agent: String,
    pub ip_address: String,
}

pub async fn map_auth_middleware(
    State(_state): State<SharedState>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, APIError> {
    let user_agent = req
        .headers()
        .get(USER_AGENT)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("unknown")
        .to_string();

    let ip = req
        .extensions()
        .get::<ClientIp>()
        .map(|ip| ip.0.to_string())
        .unwrap_or_else(|| "unknown".into());

    req.extensions_mut().insert(AuthHeader {
        user_agent,
        ip_address: ip,
    });

    Ok(next.run(req).await)
}