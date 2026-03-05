-- Add migration script here
ALTER TABLE product_variants
DROP COLUMN nsin;
ALTER TABLE product_variants RENAME COLUMN is_active TO is_enabled;