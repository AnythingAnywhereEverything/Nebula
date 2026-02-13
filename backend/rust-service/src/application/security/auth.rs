use serde::Serialize;
use std::time::{SystemTimeError};
use thiserror::Error;
use uuid::Uuid;

use crate::{
    application::{
        config::Config,
        repository::{oauth_repo, session_repo, user_repo},
        security::{argon, jwt::*, session},
        service::{jwt_service, snowflake_service, username_service::{generate_base_username, generate_username}},
        state::SharedState,
    },
    domain::models::user::User, infrastructure::database::Database,
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

pub async fn register_oauth(
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

    let user_id = if let Some(existing_user_id) =
        user_repo::get_id_by_email(&mut tx, email).await?
    {
        existing_user_id
    } else {
        let new_user_id: i64 = state.snowflake_generator.generate_id()?;

        let username = generate_base_username(email);

        let result = user_repo::insert_oauth_user(
            &mut tx,
            new_user_id,
            &username,
            display_name,
            email,
        )
        .await;

        match result {
            Ok(_) => new_user_id,
            Err(e) if Database::is_unique_violation(&e) => {
                let fallback = generate_username(email, new_user_id);

                user_repo::insert_oauth_user(
                    &mut tx,
                    new_user_id,
                    &fallback,
                    &display_name,
                    email,
                )
                .await?;

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


pub async fn logout(refresh_claims: RefreshClaims, state: SharedState) -> Result<(), AuthError> {
    // Check if revoked tokens are enabled.
    if !state.config.jwt_enable_revoked_tokens {
        Err(AuthError::RevokedTokensInactive)?
    }

    // Decode and validate the refresh token.
    if !validate_token_type(&refresh_claims, JwtTokenType::RefreshToken) {
        return Err(AuthError::InvalidToken.into());
    }
    revoke_refresh_token(&refresh_claims, &state).await?;
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
    match user_repo::is_exist(&username, &state).await? {
        true => {
            // User already exists
            return Err(AuthError::InvalidToken.into());
        }
        false => {
            let password_hash = argon::hash(password.as_bytes())
                .map_err(|e| AuthError::Argon2Error(e.to_string()))?;

            let user_id = state.snowflake_generator.generate_id()?;

            let user = User {
                id: user_id,
                display_name: display_name,
                email: email,
                password_hash: Some(password_hash),
                username: username,
                active: true,
                created_at: None,
                updated_at: None,
            };
            // Await the future so it is executed and propagate any error
            user_repo::add(user, &state).await?;
        }
    };

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

    let user_id = refresh_claims.sub.parse().unwrap();
    let user = user_repo::get_by_id(user_id, &state).await?;
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
