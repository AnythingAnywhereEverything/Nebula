use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use hyper::StatusCode;
use thiserror::Error;

use crate::api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind};

const CUSTOM_EPOCH: u64 = 1767225600000;

const WORKER_ID_BITS: u64 = 10;
const KIND_BITS: u64 = 2;
const SEQUENCE_BITS: u64 = 10;

const MAX_WORKER_ID: u64 = (1 << WORKER_ID_BITS) - 1;
const MAX_SEQUENCE: u64 = (1 << SEQUENCE_BITS) - 1;

const KIND_SHIFT: u64 = SEQUENCE_BITS;
const WORKER_ID_SHIFT: u64 = SEQUENCE_BITS + KIND_BITS;
const TIMESTAMP_SHIFT: u64 = SEQUENCE_BITS + KIND_BITS + WORKER_ID_BITS;

#[derive(Debug, Error)]
pub enum SnowflakeError {
    #[error("Worker ID ({0}) exceeds maximum allowed value ({1}).")]
    InvalidWorkerId(u64, u64),

    #[error("Clock moved backward.")]
    ClockMoveBackward,
}

struct State {
    last_timestamp: u64,
    sequence: u64,
}

#[derive(Debug, Clone, Copy)]
#[repr(u8)]
pub enum SnowflakeKind {
    Api = 0,
    Image = 1,
}

pub struct SnowflakeGenerator {
    worker_id: u64,
    kind: SnowflakeKind,
    state: Mutex<State>,
}

impl SnowflakeGenerator {
    pub fn new(worker_id: u64, kind: SnowflakeKind) -> Result<Self, SnowflakeError> {
        if worker_id > MAX_WORKER_ID {
            return Err(SnowflakeError::InvalidWorkerId(worker_id, MAX_WORKER_ID));
        }

        Ok(Self {
            worker_id,
            kind,
            state: Mutex::new(State {
                last_timestamp: 0,
                sequence: 0,
            }),
        })
    }

    pub fn generate_id(&self) -> Result<i64, SnowflakeError> {
        let mut state = self.state.lock().unwrap();
        let mut current_timestamp = current_time_millis()?;

        if current_timestamp < state.last_timestamp {
            return Err(SnowflakeError::ClockMoveBackward);
        }

        if current_timestamp == state.last_timestamp {
            state.sequence = (state.sequence + 1) & MAX_SEQUENCE;

            if state.sequence == 0 {
                while current_timestamp <= state.last_timestamp {
                    current_timestamp = current_time_millis()?;
                }
                state.sequence = 0;
            }
        } else {
            state.sequence = 0;
        }

        state.last_timestamp = current_timestamp;

        let id = (current_timestamp << TIMESTAMP_SHIFT)
            | (self.worker_id << WORKER_ID_SHIFT)
            | ((self.kind as u64) << KIND_SHIFT)
            | state.sequence;

        Ok(id as i64)
    }
}

fn current_time_millis() -> Result<u64, SnowflakeError> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|_| SnowflakeError::ClockMoveBackward)?
        .as_millis() as u64;
    Ok(now - CUSTOM_EPOCH)
}

impl From<SnowflakeError> for APIError {
    fn from(snowflake_error: SnowflakeError) -> Self {
        let (status_code, code) = match snowflake_error {
            SnowflakeError::InvalidWorkerId(_, _) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorCode::SnowflakeError,
            ),
            SnowflakeError::ClockMoveBackward => (
                StatusCode::INTERNAL_SERVER_ERROR,
                APIErrorCode::SnowflakeError,
            )
        };

        let error = APIErrorEntry::new(&snowflake_error.to_string())
            .code(code)
            .kind(APIErrorKind::SnowflakeError);

        Self {
            status: status_code.as_u16(),
            errors: vec![error],
        }
    }
}
