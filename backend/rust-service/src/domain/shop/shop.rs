use crate::domain::shop::error::ShopError;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ShopName(String);

impl ShopName {
    pub fn new(name: String) -> Result<Self, ShopError> {
        
        if name.len() < 3 || name.len() > 32 {
            return Err(ShopError::InvalidLength)
        }
        
        Ok(Self(name))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    pub fn into_inner(self) -> String {
        self.0
    }
}