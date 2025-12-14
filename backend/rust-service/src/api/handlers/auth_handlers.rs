use axum::{Json, extract::State, http::StatusCode, response::IntoResponse};
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;

use crate::{
    api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind, version::APIVersion},
    application::{
        security::{
            auth::{self, AuthError},
            jwt::RefreshClaims,
        },
        state::SharedState,
    },
};

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterUser {
    email: String,
    username: String,
    password: String,
    display_name: String,
    confirm_password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginUser {
    email: String,
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RevokeUser {
    user_id: Uuid,
}

// #[tracing::instrument(level = tracing::Level::TRACE, name = "login", skip_all, fields(username=login.username))]
// pub async fn login_handler(
//     api_version: APIVersion,
//     State(state): State<SharedState>,
//     Json(login): Json<LoginUser>,
// ) -> Result<impl IntoResponse, APIError> {
//     tracing::trace!("api version: {}", api_version);
//     // if let Ok(user) = user_repo::get_by_username(&login.username, &state).await {
//     //     if user.active && user.password_hash == login.password {
//     //         tracing::trace!("access granted, user: {}", user.id);
//     //         let tokens = auth::generate_tokens(user, &state.config);
//     //         let response = tokens_to_response(tokens);
//     //         return Ok(response);
//     //     }
//     // }

//     Ok(());

//     // tracing::error!("access denied: {:#?}", login);
//     // Err(AuthError::WrongCredentials)?
// }

#[tracing::instrument(level = tracing::Level::TRACE, name = "register", skip_all, fields(username=register.username))]
pub async fn register_handler(
    api_version: APIVersion,
    State(state): State<SharedState>,
    Json(register): Json<RegisterUser>,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("api version: {}", api_version);

    if register.confirm_password == register.password {
        auth::register(
            register.display_name,
            register.username,
            register.password,
            register.email,
            state,
        )
        .await?;
    }

    Ok(())
}

pub async fn logout_handler(
    api_version: APIVersion,
    State(state): State<SharedState>,
    refresh_claims: RefreshClaims,
) -> Result<impl IntoResponse, APIError> {
    tracing::trace!("api version: {}", api_version);
    tracing::trace!("refresh_claims: {:?}", refresh_claims);
    auth::logout(refresh_claims, state).await?;
    Ok(())
}

impl From<AuthError> for APIError {
    fn from(auth_error: AuthError) -> Self {
        let (status_code, code) = match auth_error {
            AuthError::WrongCredentials => (
                StatusCode::UNAUTHORIZED,
                APIErrorCode::AuthenticationWrongCredentials,
            ),
            AuthError::MissingCredentials => (
                StatusCode::BAD_REQUEST,
                APIErrorCode::AuthenticationMissingCredentials,
            ),
            AuthError::TokenCreationError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorCode::AuthenticationTokenCreationError,
            ),
            AuthError::InvalidToken => (
                StatusCode::BAD_REQUEST,
                APIErrorCode::AuthenticationInvalidToken,
            ),
            AuthError::Forbidden => (StatusCode::FORBIDDEN, APIErrorCode::AuthenticationForbidden),
            AuthError::RevokedTokensInactive => (
                StatusCode::BAD_REQUEST,
                APIErrorCode::AuthenticationRevokedTokensInactive,
            ),
            AuthError::RedisError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, APIErrorCode::RedisError)
            }
            AuthError::SQLxError(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorCode::DatabaseError,
            ),
            AuthError::SnowflakeError(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorCode::SnowflakeError,
            ),
            AuthError::SystemTimeError(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorCode::AuthenticationTokenCreationError,
            ),
            AuthError::Argon2Error(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, APIErrorCode::Argon2Error)
            }
        };

        let error = APIErrorEntry::new(&auth_error.to_string())
            .code(code)
            .kind(APIErrorKind::AuthenticationError);

        Self {
            status: status_code.as_u16(),
            errors: vec![error],
        }
    }
}
