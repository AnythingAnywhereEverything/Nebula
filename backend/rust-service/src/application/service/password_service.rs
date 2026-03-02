use serde::Serialize;

use crate::{application::{ repository::user_repo, 
    security::argon, 
    service::errors::PasswordServiceError, 
    state::{AppState} 

}, };

#[derive(Serialize)]
pub struct PasswordResponse {
    pub current_password: Option<String>,
    pub new_password: Option<String>,
    pub comfirm_password: Option<String>
}
pub struct PasswordSerivce;
impl PasswordSerivce {
    async fn hash_new_password(new_password: &str) -> Result<String, argon2::password_hash::Error> {
        argon::hash(new_password.as_bytes()).map_err(|_| argon2::password_hash::Error::ParamNameInvalid)
    }
    pub async fn change_password(
        state: &AppState,
        user_id: i64,
        current_password: &str,
        new_password: &str,
        confirm_password: &str
    ) -> Result<(), PasswordServiceError>{
        let mut tx = state.db_pool.begin().await?;
        let user_new_password = Self::hash_new_password(confirm_password).await?;
        let stored_current_password = user_repo::is_current_password_match(&mut tx, user_id).await?;

        if new_password != confirm_password {
            return Err(PasswordServiceError::NewPasswordNotMatch);
        }
        
        let is_password_match = argon::verify(
            current_password.as_bytes(),
             &stored_current_password)
            .expect("Password doesn't match");

        if !is_password_match {
            return Err(PasswordServiceError::CurrentPasswordNotMatch);
        }
        user_repo::set_new_password(&mut tx, user_id, user_new_password.into()).await?;
        tx.commit().await?;

        return Ok(())
    }
}