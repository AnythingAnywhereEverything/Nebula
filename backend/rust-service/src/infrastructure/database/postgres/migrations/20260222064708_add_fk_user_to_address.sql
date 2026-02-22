-- Add migration script here
ALTER TABLE addresses
ADD COLUMN user_id BIGINT NOT NULL,
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;
