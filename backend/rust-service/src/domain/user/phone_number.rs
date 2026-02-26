use phonenumber;

use crate::domain::user::error::PhoneNumberError;

pub struct PhoneNumber {
    pub international_number: String,
    pub national_number: String,
    pub country_code: String,
}

impl PhoneNumber {
    /// Receives an international phone number in string format, validates it, and returns a PhoneNumber instance if valid.
    pub fn new(input: &str) -> Result<Self, PhoneNumberError> {
        
        match phonenumber::parse(None, input) {
            Ok(number) => {
                if phonenumber::is_valid(&number) {
                    return Ok(Self {
                        international_number: number.to_string(),
                        national_number: number.national().to_string(),
                        country_code: number.country().code().to_string(),
                    });
                } else {
                    return Err(PhoneNumberError::InvalidStructure)
                }
            },
            Err(_) => Err(PhoneNumberError::InvalidFormat)
        }
    }

    pub fn as_str(&self) -> &str {
        &self.international_number
    }

    pub fn into_inner(self) -> String {
        self.international_number
    }
}