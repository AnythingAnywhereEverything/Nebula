-- Add migration script here
ALTER TABLE users
ADD COLUMN username TEXT UNIQUE NOT NULL,
ADD COLUMN display_name TEXT NOT NULL;

ALTER TABLE users
DROP COLUMN firstname,
DROP COLUMN lastname;
