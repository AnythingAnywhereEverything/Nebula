use hyper::StatusCode;
use serde::Serialize;
use std::time::{SystemTimeError};
use thiserror::Error;
use uuid::Uuid;

use crate::{
    api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind}, application::{
        config::Config,
        repository::{oauth_repo, session_repo::{self, validate_session}, user_repo},
        security::{argon, jwt::*, session},
        service::{jwt_service, snowflake_service, username_service::{generate_base_username, generate_username}},
        state::SharedState,
    }, domain::models::user::{NewUser, User}, infrastructure::database::Database
};

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize)]
pub struct AuthToken {
    pub user_id: i64,
    pub created_time: i64,
    pub rand_string: String,
    pub package: String,
}

pub struct JwtTokens {
    pub access_token: String,
    pub refresh_token: String,
}

pub async fn login_oauth(
    state: &SharedState,
    provider: &str,
    provider_user_id: &str,
    email: &str,
    display_name: &str,
) -> Result<i64, AuthError> {
    let mut tx = state.db_pool.begin().await?;

    if let Some(user_id) =
        oauth_repo::get_user_id_by_provider(&mut tx, provider, provider_user_id).await?
    {
        tx.commit().await?;
        return Ok(user_id);
    }

    let user_id: i64 = if let Ok(existing_user) =
        user_repo::get_by_username_or_email(&mut tx, email).await
    {
        existing_user.id
    } else {
        let new_user_id: i64 = state.snowflake_generator.generate_id()?;
        let username = generate_base_username(email);

        let user = NewUser {
            id: new_user_id,
            display_name: display_name.to_string(),
            email: email.to_string(),
            username: username.clone(),
            password_hash: None,
        };

        let result = user_repo::add(&mut tx, user).await;

        match result {
            Ok(_) => new_user_id,
            Err(e) if Database::is_unique_violation(&e) => {
                let fallback = generate_username(email, new_user_id);

                let user = NewUser {
                    id: new_user_id,
                    display_name: display_name.to_string(),
                    email: email.to_string(),
                    username: fallback.clone(),
                    password_hash: None,
                };
                user_repo::add(&mut tx, user).await?;
                new_user_id
            }
            Err(e) => return Err(e.into()),
        };

        new_user_id
    };

    let oauth_id = state.snowflake_generator.generate_id()?;

    oauth_repo::insert(
        &mut tx,
        oauth_id,
        user_id,
        provider,
        provider_user_id,
    )
    .await?;

    tx.commit().await?;

    Ok(user_id)
}

pub async fn validate_user_permission(
    token: &str,
    state: &SharedState,
    id: i64
) -> Result<(), AuthError> {
    let token_parsed = session::parse(&token)?;
    let mut tx = state.db_pool.begin().await?;
    
    validate_session(&mut tx, &state.redis, token_parsed.user_id, token_parsed.created_time, 60 * 60).await?;
    if token_parsed.user_id != id {
        return Err(AuthError::MissingAppropriatePermission);
    }
    Ok(())
}

pub async fn logout(token: &str, state: SharedState) -> Result<(), AuthError> {
    let mut tx = state.db_pool.begin().await?;
    session_repo::delete_session_by_token(&mut tx, &state.redis, &token).await?;
    Ok(())
}

pub async fn register(
    display_name: String,
    username: String,
    password: String,
    email: String,
    state: SharedState,
) -> Result<(), AuthError> {
    // Check if user exist or not
    let mut tx = state.db_pool.begin().await?;

    match user_repo::is_exist(&username, &state).await? {
        true => {
            // User already exists
            return Err(AuthError::InvalidToken.into());
        }
        false => {
            let password_hash = argon::hash(password.as_bytes())
                .map_err(|e| AuthError::Argon2Error(e.to_string()))?;

            let user_id = state.snowflake_generator.generate_id()?;

            let user = NewUser {
                id: user_id,
                display_name: display_name,
                email: email,
                password_hash: Some(password_hash),
                username: username,
            };
            user_repo::add(&mut tx, user).await?;
        }
    };

    tx.commit().await?;

    Ok(())
}

pub async fn save_session_token(
    user_id: i64,
    token: AuthToken,
    state: &SharedState,
    user_agent: &str,
    ip_address: &str,
) -> Result<(), AuthError> {
    let mut tx = state.db_pool.begin().await?;

    let id = state.snowflake_generator.generate_id()?;

    session_repo::save_session(
        &mut tx,
        &state.redis,
        id,
        user_id,
        token,
        user_agent,
        ip_address,
        60 * 60, // TTL 1 hours
    )
    .await?;

    tx.commit().await?;

    Ok(())
}

pub async fn refresh(
    refresh_claims: RefreshClaims,
    state: SharedState,
) -> Result<JwtTokens, AuthError> {
    // Decode and validate the refresh token.
    if !validate_token_type(&refresh_claims, JwtTokenType::RefreshToken) {
        return Err(AuthError::InvalidToken.into());
    }

    // Check if revoked tokens are enabled.
    if state.config.jwt_enable_revoked_tokens {
        revoke_refresh_token(&refresh_claims, &state).await?;
    }

    let mut tx = state.db_pool.begin().await?;

    let user_id = refresh_claims.sub.parse().unwrap();
    let user = user_repo::get_by_id(&mut tx, user_id).await?;
    let tokens = generate_jwt(user, &state.config);
    Ok(tokens)
}

pub fn validate_token_type(claims: &RefreshClaims, expected_type: JwtTokenType) -> bool {
    if claims.typ == expected_type as u8 {
        true
    } else {
        tracing::error!(
            "Invalid token type. Expected {:?}, Found {:?}",
            expected_type,
            JwtTokenType::from(claims.typ),
        );
        false
    }
}

async fn revoke_refresh_token(
    refresh_claims: &RefreshClaims,
    state: &SharedState,
) -> Result<(), AuthError> {
    // Check the validity of refresh token.
    validate_revoked(refresh_claims, state).await?;

    jwt_service::revoke_refresh_token(refresh_claims, state).await?;
    Ok(())
}

pub fn generate_jwt(user: User, config: &Config) -> JwtTokens {
    let time_now = chrono::Utc::now();
    let iat = time_now.timestamp() as usize;
    let sub = user.id.to_string();

    let access_token_id = Uuid::new_v4().to_string();
    let refresh_token_id = Uuid::new_v4().to_string();
    let access_token_exp = (time_now
        + chrono::Duration::seconds(config.jwt_expire_access_token_seconds))
    .timestamp() as usize;

    let access_claims = AccessClaims {
        sub: sub.clone(),
        jti: access_token_id.clone(),
        iat,
        exp: access_token_exp,
        typ: JwtTokenType::AccessToken as u8,
    };

    let refresh_claims = RefreshClaims {
        sub,
        jti: refresh_token_id,
        iat,
        exp: (time_now + chrono::Duration::seconds(config.jwt_expire_refresh_token_seconds))
            .timestamp() as usize,
        prf: access_token_id,
        pex: access_token_exp,
        typ: JwtTokenType::RefreshToken as u8,
    };

    tracing::info!(
        "JWT: generated claims\naccess {:#?}\nrefresh {:#?}",
        access_claims,
        refresh_claims
    );

    let access_token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &access_claims,
        &jsonwebtoken::EncodingKey::from_secret(config.jwt_secret.as_ref()),
    )
    .unwrap();

    let refresh_token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &refresh_claims,
        &jsonwebtoken::EncodingKey::from_secret(config.jwt_secret.as_ref()),
    )
    .unwrap();

    tracing::info!(
        "JWT: generated tokens\naccess {:#?}\nrefresh {:#?}",
        access_token,
        refresh_token
    );

    JwtTokens {
        access_token,
        refresh_token,
    }
}

pub async fn validate_revoked<T: std::fmt::Debug + ClaimsMethods + Sync + Send>(
    claims: &T,
    state: &SharedState,
) -> Result<(), AuthError> {
    let revoked = jwt_service::is_revoked(claims, state).await?;
    if revoked {
        Err(AuthError::WrongCredentials)?;
    }
    Ok(())
}

#[derive(Debug, Error)]
pub enum AuthError {
    #[error("unsupported oauth provider")]
    UnsupportedOAuthProvider,
    #[error("invalid google access token")]
    InvalidGoogleAccessToken,
    #[error("does not have an appropriate permission")]
    MissingAppropriatePermission,
    #[error("email not verified")]
    EmailNotVerified,
    #[error("wrong credentials")]
    WrongCredentials,
    #[error("missing credentials")]
    MissingCredentials,
    #[error("token creation error")]
    TokenCreationError,
    #[error("invalid token")]
    InvalidToken,
    #[error("use of revoked tokens is inactive")]
    RevokedTokensInactive,
    #[error("forbidden")]
    Forbidden,
    #[error(transparent)]
    SystemTimeError(#[from] SystemTimeError),
    #[error(transparent)]
    SnowflakeError(#[from] snowflake_service::SnowflakeError),
    #[error(transparent)]
    RedisError(#[from] redis::RedisError),
    #[error("Argon2Error : {0}")]
    Argon2Error(String),
    #[error(transparent)]
    SQLxError(#[from] sqlx::Error),
    #[error(transparent)]
    SessionError(#[from] session::SessionError),
}


impl From<AuthError> for APIError {
    fn from(auth_error: AuthError) -> Self {
        let (status_code, code) = match auth_error {
            AuthError::SessionError(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorCode::SessionError,
            ),
            AuthError::EmailNotVerified => (
                StatusCode::UNAUTHORIZED,
                APIErrorCode::AuthenticationEmailNotVerified,
            ),
            AuthError::InvalidGoogleAccessToken => (
                StatusCode::UNAUTHORIZED,
                APIErrorCode::AuthenticationInvalidGoogleAccessToken,
            ),
            AuthError::UnsupportedOAuthProvider => (
                StatusCode::BAD_REQUEST,
                APIErrorCode::AuthenticationUnsupportedOAuthProvider,
            ),
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
            AuthError::MissingAppropriatePermission => (
                StatusCode::UNAUTHORIZED,
                APIErrorCode::AuthenticationMissingAppropriatePermission
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