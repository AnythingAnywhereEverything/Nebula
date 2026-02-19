use serde::Serialize;

use crate::{
    api::middleware::auth_mw::AuthHeader, application::{
        repository::{errors::UserRepoError, oauth_repo, user_repo},
        security::argon,
        service::{errors::AuthServiceError, session_service::SessionService}, state::AppState,
    }, domain::{models::user::NewUser, session::session_token::SessionToken, user::username::Username}, infrastructure::database::Database
};

#[derive(Serialize)]
pub struct LoginResponse {
    token: String,
    user_id: String
}
pub struct AuthService;

impl AuthService {
    pub async fn login_oauth(
        state: &AppState,
        provider: &str,
        provider_user_id: &str,
        email: &str,
        display_name: &str,
    ) -> Result<i64, AuthServiceError> {
        let mut tx = state.db_pool.begin().await?;

        if let Some(user_id) =
            oauth_repo::get_user_id_by_provider(&mut tx, provider, provider_user_id).await?
        {
            tx.commit().await?;
            return Ok(user_id);
        }

        let user_id =
            if let Ok(existing_user) = user_repo::get_by_username_or_email(&mut tx, email).await {
                existing_user.id
            } else {
                let new_user_id = state.snowflake_generator.generate_id()?;

                let base_username = Username::from_oauth_email(email);

                let user = NewUser {
                    id: new_user_id,
                    display_name: display_name.to_string(),
                    email: email.to_string(),
                    username: base_username.as_str().to_string(),
                    password_hash: None,
                };

                match user_repo::add(&mut tx, user).await {
                    Ok(_) => new_user_id,
                    Err(e) if Database::is_unique_violation(&e) => {
                        let fallback = Username::fallback_from_email(email, new_user_id);

                        let user = NewUser {
                            id: new_user_id,
                            display_name: display_name.to_string(),
                            email: email.to_string(),
                            username: fallback.into_inner(),
                            password_hash: None,
                        };

                        user_repo::add(&mut tx, user).await?;
                        new_user_id
                    }
                    Err(e) => return Err(e.into()),
                }
            };

        let oauth_id = state.snowflake_generator.generate_id()?;

        oauth_repo::insert(&mut tx, oauth_id, user_id, provider, provider_user_id).await?;

        tx.commit().await?;

        Ok(user_id)
    }

    pub async fn logout(state: &AppState, token: &str) -> Result<(), AuthServiceError> {
        SessionService::delete_session(state, token).await.map_err(|_| AuthServiceError::LogoutFailed)?;
        Ok(())
    }

    pub async fn register(
        state: &AppState,
        display_name: String,
        username: String,
        password: String,
        email: String,
    ) -> Result<(), AuthServiceError> {
        let mut tx = state.db_pool.begin().await?;

        let username = Username::new(&username)?;

        if user_repo::is_exist(&mut tx, &username.as_str()).await? {
            return Err(AuthServiceError::UserRepository(UserRepoError::UsernameAlreadyTaken(username.into_inner())));
        }

        let password_hash =
            argon::hash(password.as_bytes()).map_err(|_| AuthServiceError::UnableToHashSession)?;

        let user_id = state.snowflake_generator.generate_id()?;

        let user = NewUser {
            id: user_id,
            display_name,
            email,
            password_hash: Some(password_hash),
            username: username.into_inner(),
        };

        user_repo::add(&mut tx, user).await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn login(
        state: &AppState, 
        username_or_email: &str,
        input_password: &str,
        auth_header: AuthHeader
    ) -> Result<LoginResponse, AuthServiceError> {
        let mut tx = state.db_pool.begin().await?;

        if let Ok(user) = user_repo::get_by_username_or_email(&mut tx, username_or_email).await {
            let is_password_match = argon::verify(
                input_password.as_bytes(),
                &user.password_hash.unwrap_or_default()
            ).expect("Username or password invalid");

            if user.is_active && is_password_match {
                tracing::trace!("access granted, user: {}", user.username);

                let token: SessionToken = SessionToken::new(user.id)?;

                // create session
                SessionService::create_session(
                    &state, 
                    user.id, 
                    &auth_header.user_agent,
                    &auth_header.ip_address,
                    60 * 60
                ).await?;

                let response = LoginResponse{
                    token: token.full_token,
                    user_id: user.id.to_string()
                };

                return Ok(response)
            }
        }

        Err(AuthServiceError::InvalidCredentials)?
    }

    //TODO: implement Email Token
}
