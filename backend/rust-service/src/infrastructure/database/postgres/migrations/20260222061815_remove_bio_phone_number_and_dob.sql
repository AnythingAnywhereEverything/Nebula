-- Add migration script here
ALTER TABLE users
DROP COLUMN bio,
DROP COLUMN date_of_birth,
DROP COLUMN phone_number;