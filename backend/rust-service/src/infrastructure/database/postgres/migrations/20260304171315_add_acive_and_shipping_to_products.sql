-- Add migration script here
ALTER TABLE products
ADD COLUMN is_active BOOLEAN DEFAULT FALSE,
ADD COLUMN free_shipping BOOLEAN DEFAULT FALSE;