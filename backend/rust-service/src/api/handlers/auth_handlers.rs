use axum::{Extension, Json, extract::State, response::IntoResponse};
use hyper::HeaderMap;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::{
    api::{APIError, middleware::auth_mw::AuthHeader, version::APIVersion},
    application::{
        repository::user_repo,
        security::{
            auth::AuthError,
            oauth::google::fetch_google_userinfo,
        },
        service::{auth_service::AuthService, errors::SessionServiceError, session_service::SessionService},
        state::SharedState,
    },
    domain::{models::oauth_account::GoogleUserInfo, session::session_token::SessionToken},
};

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterUser {
    username: String,
    email: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginUser {
    username_or_email: String,
    password: String,
}

#[derive(Debug, Deserialize)]
pub struct OAuthRegisterRequest {
    provider: String,
    access_token: String,
}

#[derive(Debug, Serialize)]
pub struct OAuthRegisterResponse {
    pub user_id: String,
    pub token: String,
}

#[tracing::instrument(level = tracing::Level::TRACE, name = "oauth", skip_all, fields(username=payload.provider))]
pub async fn oauth_login_handler(
    api_version: APIVersion,
    Extension(auth): Extension<AuthHeader>,
    State(state): State<SharedState>,
    Json(payload): Json<OAuthRegisterRequest>,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("api version: {}", api_version);

    if payload.provider != "google" {
        return Err(AuthError::UnsupportedOAuthProvider)?;
    }

    let userinfo: GoogleUserInfo = fetch_google_userinfo(&payload.access_token)
        .await
        .map_err(|_| AuthError::InvalidGoogleAccessToken)?;

    if !userinfo.email_verified {
        return Err(AuthError::EmailNotVerified)?;
    }

    let full_name = userinfo.name.unwrap_or_else(|| {
        format!(
            "{} {}",
            userinfo.given_name.unwrap_or_default(),
            userinfo.family_name.unwrap_or_default()
        )
    });

    let user_id: i64 =
        AuthService::login_oauth(
            &state, 
            "google", 
            &userinfo.sub, 
            &userinfo.email, 
            &full_name
        ).await?;

    let tokens: SessionToken = SessionToken::new(user_id)
        .await
        .map_err(SessionServiceError::from)?;

    SessionService::create_session(
        &state,
        user_id,
        &auth.user_agent,
        &auth.ip_address.to_string(),
        60 * 60
    ).await?;

    let response = OAuthRegisterResponse {
        user_id: user_id.to_string(),
        token: tokens.full_token,
    };

    Ok(Json(response))
}

#[tracing::instrument(level = tracing::Level::TRACE, name = "validate", skip_all)]
pub async fn validate_handler(
    api_version: APIVersion,
    State(state): State<SharedState>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, APIError> {
    tracing::info!("api version: {}", api_version);

    let token = headers
        .get("token")
        .and_then(|token| token.to_str().ok())
        .unwrap_or("");

    if token.is_empty() {
        return Err(AuthError::InvalidToken)?;
    }

    let token_parsed = SessionToken::parse(token).map_err(SessionServiceError::from)?;
    SessionService::validate_session(
        &state,
        token_parsed.user_id,
        token_parsed.timestamp,
        60 * 60,
        60 * 60,
    )
    .await?;

    let mut tx = state.db_pool.begin().await?;

    let user = user_repo::get_by_id(&mut tx, token_parsed.user_id).await?;

    let response = Json(json!({
        "user": user,
    }));

    Ok(response)
}

#[tracing::instrument(level = tracing::Level::TRACE, name = "login", skip_all, fields(username=login.username_or_email))]
pub async fn login_handler(
    api_version: APIVersion,
    Extension(auth): Extension<AuthHeader>,
    State(state): State<SharedState>,
    Json(login): Json<LoginUser>,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("api version: {}", api_version);
    
    let response = AuthService::login(
        &state, 
        &login.username_or_email, 
        &login.password, 
        auth
    ).await?;
    
    Ok(Json(json!(response)))
}

#[tracing::instrument(level = tracing::Level::TRACE, name = "register", skip_all)]
pub async fn register_handler(
    api_version: APIVersion,
    State(state): State<SharedState>,
    Json(register): Json<RegisterUser>,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("api version: {}", api_version);

    AuthService::register(
        &state,
        register.username.clone(), // default display name as username
        register.username,
        register.password,
        register.email,
    ).await?;

    let response = Json(json!({
        "message": "User registered successfully"
    }));

    Ok(response)
}

pub async fn logout_handler(
    api_version: APIVersion,
    State(state): State<SharedState>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("api version: {}", api_version);
    let token: &str = headers
        .get("token")
        .and_then(|token| token.to_str().ok())
        .unwrap_or("");
    AuthService::logout(&state, token).await?;
    Ok(())
}
