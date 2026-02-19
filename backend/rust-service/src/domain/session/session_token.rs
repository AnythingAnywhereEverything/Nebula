use chrono::Utc;
use rand::{Rng, distr::Alphanumeric};

use crate::domain::session::{error::SessionError, token::Token};

#[derive(Debug)]
pub struct SessionToken {
    pub user_id: i64,
    pub timestamp: i64,
    pub random_string: String,
    pub full_token: String,
}

impl SessionToken {
    #[tracing::instrument(level = tracing::Level::TRACE, name = "Session token generation", skip_all, fields(user_id=user_id))]
    pub fn new(user_id: i64) -> Result<SessionToken, SessionError> {
        let now = Utc::now();
        let timestamp_millis = now.timestamp_millis();
    
        let timestamp_part = timestamp_millis.to_string();
        
        let random_string_length = 32;
        let random_string: String = rand::rng()
            .sample_iter(&Alphanumeric)
            .take(random_string_length)
            .map(char::from)
            .collect();
        
        let encoded_user_id = Token::new(user_id.to_string());
        let encoded_timestamp_part = Token::new(&timestamp_part);
        let encoded_random_string = Token::new(&random_string);
    
        if encoded_random_string.as_str().is_empty() {
            return Err(SessionError::SessionCreationError);
        }
        
        let full_discord_like_token = format!(
            "{}.{}.{}",
            encoded_user_id.into_inner(),
            encoded_timestamp_part.into_inner(),
            encoded_random_string.into_inner()
        );
    
        Ok(SessionToken {
            user_id,
            timestamp: timestamp_millis,
            random_string: random_string,
            full_token: full_discord_like_token,
        })
    }
    
    pub fn parse(token: &str) -> Result<SessionToken, SessionError> {
        let parts: Vec<&str> = token.split('.').collect();
        if parts.len() != 3 {
            return Err(SessionError::InvalidSession);
        }
    
        let decoded_user_id = Token::decode(parts[0])?;
    
        let decoded_timestamp = Token::decode(parts[1])?;
    
        let decoded_random_string = Token::decode(parts[2])?;
    
        Ok(SessionToken {
            user_id: decoded_user_id.parse::<i64>().map_err(|_| SessionError::InvalidSession)?,
            timestamp: decoded_timestamp.parse::<i64>().map_err(|_| SessionError::InvalidSession)?,
            random_string: decoded_random_string,
            full_token: token.to_string(),
        })
    }
}