use base64::{Engine, engine::general_purpose};
use rand::{Rng, distr::Alphanumeric};

use crate::domain::session::error::TokenError;

#[derive(Debug)]
pub struct Token(String);

impl Token {
    pub fn new<T: AsRef<[u8]>>(input: T) -> Self {
        Self(general_purpose::STANDARD_NO_PAD.encode(input))
    }

    pub fn rand(length: usize) -> Self {
        let random_string: String = rand::rng()
            .sample_iter(&Alphanumeric)
            .take(length)
            .map(char::from)
            .collect();
        Self(general_purpose::STANDARD_NO_PAD.encode(random_string))
    }

    pub fn decode<T: AsRef<[u8]>>(input: T) -> Result<String, TokenError> {
        let decode = String::from_utf8(
            general_purpose::STANDARD_NO_PAD
                .decode(input)
                .map_err(|_| TokenError::InvalidToken)?,
        )
        .map_err(|_| TokenError::InvalidToken)?;

        Ok(decode)
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    pub fn into_inner(self) -> String {
        self.0
    }
}
