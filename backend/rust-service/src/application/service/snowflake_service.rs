use std::sync::Mutex;
use std::time::{SystemTime, SystemTimeError, UNIX_EPOCH};
use thiserror::Error;

// Constants for bit allocation (adjust as needed)
const TIMESTAMP_BITS: u64 = 41;
const WORKER_ID_BITS: u64 = 10;
const SEQUENCE_BITS: u64 = 12;

const MAX_WORKER_ID: u64 = (1 << WORKER_ID_BITS) - 1;
const MAX_SEQUENCE: u64 = (1 << SEQUENCE_BITS) - 1;

// Shift amounts
const WORKER_ID_SHIFT: u64 = SEQUENCE_BITS;
const TIMESTAMP_SHIFT: u64 = SEQUENCE_BITS + WORKER_ID_BITS;

#[derive(Debug, Error)]
pub enum SnowflakeError {
    #[error("Worker ID ({0}) exceeds maximum allowed value ({1}).")]
    InvalidWorkerId(u64, u64),
    #[error("Sequence overflow, need to wait for next millisecond.")]
    SequenceOverflow,
    #[error("Clock moved backward, refusing to generate ID.")]
    ClockMoveBackward,
    #[error("Failed to acquire mutex lock: {0}")]
    MutexLockError(String),
    #[error("System time error: {0}")]
    SystemTimeError(#[from] SystemTimeError),
}

pub struct SnowflakeGenerator {
    worker_id: u64,
    last_timestamp: Mutex<u64>,
    sequence: Mutex<u64>,
}

impl SnowflakeGenerator {
    pub fn new(worker_id: u64) -> Result<Self, SnowflakeError> {
        if worker_id > MAX_WORKER_ID {
            return Err(SnowflakeError::InvalidWorkerId(worker_id, MAX_WORKER_ID));
        }

        Ok(SnowflakeGenerator {
            worker_id,
            last_timestamp: Mutex::new(0),
            sequence: Mutex::new(0),
        })
    }

    pub fn generate_id(&self) -> Result<i64, SnowflakeError> {
        let mut last_timestamp_guard = self
            .last_timestamp
            .lock()
            .map_err(|e| SnowflakeError::MutexLockError(format!("{}", e)))?; // Convert PoisonError to String
        let mut sequence_guard = self
            .sequence
            .lock()
            .map_err(|e| SnowflakeError::MutexLockError(format!("{}", e)))?; // Convert PoisonError to String

        let current_timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)? // This will automatically convert SystemTimeError due to #[from]
            .as_millis() as u64;

        if current_timestamp < *last_timestamp_guard {
            return Err(SnowflakeError::ClockMoveBackward);
        }

        if current_timestamp == *last_timestamp_guard {
            *sequence_guard = (*sequence_guard + 1) & MAX_SEQUENCE;
            if *sequence_guard == 0 {
                return Err(SnowflakeError::SequenceOverflow);
            }
        } else {
            *sequence_guard = 0;
        }

        *last_timestamp_guard = current_timestamp;

        let id = (current_timestamp << TIMESTAMP_SHIFT)
            | (self.worker_id << WORKER_ID_SHIFT)
            | *sequence_guard;

        Ok(id as i64)
    }
}
