use once_cell::sync::Lazy;
use regex::Regex;

use crate::domain::user::error::UsernameError;

static VALID_USERNAME_RE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"^[a-z0-9._]+$").unwrap());

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Username(String);

impl Username {
    pub fn new(input: &str) -> Result<Self, UsernameError> {
        let username = input.to_lowercase();

        // Length rule
        if username.len() < 3 || username.len() > 32 {
            return Err(UsernameError::InvalidLength);
        }

        // Allowed characters
        if !VALID_USERNAME_RE.is_match(&username) {
            return Err(UsernameError::InvalidCharacters);
        }

        // No consecutive periods
        if username.contains("..") {
            return Err(UsernameError::ConsecutivePeriods);
        }

        Ok(Self(username))
    }

    pub fn from_oauth_email(email: &str) -> String {
        let local = email.split('@').next().unwrap_or("user");

        let filtered: String = local
            .to_lowercase()
            .chars()
            .filter(|c| c.is_ascii_alphanumeric() || *c == '.' || *c == '_')
            .collect();

        // collapse consecutive dots
        let mut cleaned = filtered.replace("..", ".");

        // remove leading/trailing dots
        cleaned = cleaned.trim_matches('.').to_string();

        if cleaned.is_empty() {
            "user".to_string()
        } else {
            cleaned
        }
    }

    pub fn fallback_from_email(email: &str, user_id: i64) -> Username {
        let base = Self::from_oauth_email(email);

        let suffix = Self::to_base62(user_id as u64);

        // reserve space for "_" + suffix
        let max_base_len = 32 - (suffix.len() + 1);

        let truncated_base = if base.len() > max_base_len {
            &base[..max_base_len]
        } else {
            &base
        };

        let candidate = format!("{}_{}", truncated_base, suffix);

        // Safe to unwrap because we guarantee format rules
        Username::new(&candidate)
            .expect("Generated username must always be valid")
    }

    fn to_base62(mut num: u64) -> String {
        const BASE62: &[u8] =
            b"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        if num == 0 {
            return "0".to_string();
        }

        let mut buf = Vec::new();

        while num > 0 {
            buf.push(BASE62[(num % 62) as usize]);
            num /= 62;
        }

        buf.reverse();
        String::from_utf8(buf).unwrap()
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    pub fn into_inner(self) -> String {
        self.0
    }
}