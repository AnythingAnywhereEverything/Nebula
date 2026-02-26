use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use crate::domain::user::phone_number::PhoneNumber;



#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct Address {
    pub id: i64,

    pub user_id: i64,

    pub address_line1: String,
    pub address_line2: Option<String>,
    pub full_name: String,

    pub city: String,
    pub country: String,
    pub state: String,
    
    pub zip_code: String,
    pub phone_number: String,
    pub is_default: Option<bool>,

    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct NewAddress {
    pub id: i64,

    pub user_id: i64,

    pub address_line1: String,
    pub address_line2: Option<String>,
    pub full_name: String,

    pub city: String,
    pub country: String,
    pub state: String,
    
    pub zip_code: String,
    pub phone_number: String,
    pub is_default: bool,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct AddressResponse {
    pub id: String,
    pub address_line1: String,
    pub address_line2: Option<String>,
    pub full_name: String,
    pub city: String,
    pub country: String,
    pub state: String,
    pub zip_code: String,
    pub phone_number: String,
    pub phone_code: String,
    pub is_default: bool,
}

impl From<Address> for AddressResponse {
    fn from(addr: Address) -> Self {
        let phone_number = match PhoneNumber::new(&addr.phone_number) {
            Ok(num) => num,
            Err(_) => PhoneNumber {
                international_number: addr.phone_number.clone(),
                national_number: addr.phone_number.clone(),
                country_code: String::new(),
            },
         };

        Self {
            id: addr.id.to_string(),
            address_line1: addr.address_line1,
            address_line2: addr.address_line2,
            full_name: addr.full_name,
            city: addr.city,
            country: addr.country,
            state: addr.state,
            zip_code: addr.zip_code,
            phone_number: phone_number.national_number,
            phone_code: phone_number.country_code,
            is_default: addr.is_default.unwrap_or(false),
        }
    }
}