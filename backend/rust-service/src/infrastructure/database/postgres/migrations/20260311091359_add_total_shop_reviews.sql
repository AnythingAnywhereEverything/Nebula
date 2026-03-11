-- Add migration script here
ALTER TABLE shops
ADD COLUMN review_amount int8 DEFAULT 0 NOT NULL,
ADD COLUMN rating numeric(3,2) DEFAULT 0 NOT NULL;