
use axum::{Json, extract::{State}, response::IntoResponse};
use axum_client_ip::ClientIp;
use hyper::HeaderMap;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::types::Uuid;

use crate::{
    api::{APIError, version::APIVersion},
    application::{
        repository::{session_repo::validate_session, user_repo}, security::{
            argon, auth::{self, AuthError, AuthToken}, oauth::google::fetch_google_userinfo, session
        }, state::SharedState
    }, domain::models::oauth_account::GoogleUserInfo,
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

#[derive(Debug, Serialize, Deserialize)]
pub struct RevokeUser {
    user_id: Uuid,
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
    State(state): State<SharedState>,
    ClientIp(ip): ClientIp,
    headers: HeaderMap,
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

    let full_name = userinfo
        .name
        .unwrap_or_else(|| format!(
            "{} {}",
            userinfo.given_name.unwrap_or_default(),
            userinfo.family_name.unwrap_or_default()
        ));

    let user_id: i64 = auth::login_oauth(
        &state,
        "google",
        &userinfo.sub,
        &userinfo.email,
        &full_name,
    ).await?;

    let tokens: AuthToken = session::new(user_id).await?;

    let user_agent = headers
        .get("user-agent")
        .and_then(|ua| ua.to_str().ok())
        .unwrap_or("unknown");

    auth::save_session_token(
        user_id,
        tokens.clone(),
        &state,
        user_agent,
        &ip.to_string(),
    ).await?;

    let response = OAuthRegisterResponse {
        user_id: user_id.to_string(),
        token: tokens.package,
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

    //validate only
    let token_parsed = session::parse(token)?;
    let mut tx = state.db_pool.begin().await?;

    validate_session(&mut tx, &state.redis, token_parsed.user_id, token_parsed.created_time, 60 * 60).await?;

    let user = user_repo::get_by_id(&mut tx, token_parsed.user_id).await?;

    let response = Json(json!({
        "user": user,
    }));

    Ok(response)
}



#[tracing::instrument(level = tracing::Level::TRACE, name = "login", skip_all, fields(username=login.username_or_email))]
pub async fn login_handler(
    api_version: APIVersion,
    State(state): State<SharedState>,
    ClientIp(ip): ClientIp,
    headers: HeaderMap,
    Json(login): Json<LoginUser>,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("api version: {}", api_version);
    let mut tx = state.db_pool.begin().await?;

    if let Ok(user) = user_repo::get_by_username_or_email(&mut tx, &login.username_or_email).await {
        let password_valid = argon::verify(login.password.as_bytes(), &user.password_hash.unwrap_or_default())
            .expect("Password verification failed");

        if user.is_active && password_valid {
            tracing::trace!("access granted, user: {}", user.id);
            let tokens: AuthToken = session::new(user.id).await?;
            let response = Json(json!(
                {
                    "user_id": user.id.to_string(),
                    "token" : tokens.package,
                }
            ));

            let user_agent = headers
                .get("user-agent")
                .and_then(|ua| ua.to_str().ok())
                .unwrap_or("unknown");

            auth::save_session_token(
                user.id,
                tokens,
                &state,
                user_agent,
                &ip.to_string(),
            )
            .await?;

            return Ok(response);
        }
    }
    tracing::error!("access denied: {:#?}", login);
    Err(AuthError::WrongCredentials)?
}

#[tracing::instrument(level = tracing::Level::TRACE, name = "register", skip_all)]
pub async fn register_handler(
    api_version: APIVersion,
    State(state): State<SharedState>,
    Json(register): Json<RegisterUser>,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("api version: {}", api_version);

    auth::register(
        register.username.clone(), // default display name as username
        register.username,
        register.password,
        register.email,
        state,
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
    auth::logout(token, state).await?;
    Ok(())
}
