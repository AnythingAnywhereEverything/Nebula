-- Add migration script here
ALTER TABLE users
ADD COLUMN profile_picture_url TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN phone_number TEXT;

-- rename active to is_active, and last_login_at to last_login
ALTER TABLE users
RENAME COLUMN active TO is_active;

ALTER TABLE users
RENAME COLUMN last_login_at TO last_login;