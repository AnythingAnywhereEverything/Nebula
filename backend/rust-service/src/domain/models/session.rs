use sqlx::prelude::FromRow;
use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug,FromRow,Deserialize,Serialize,PartialEq,Eq)]
pub struct Session{
    pub id: i64,
    pub created_at: NaiveDateTime,
    pub agent: String,
}
