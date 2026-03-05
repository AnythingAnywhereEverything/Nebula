-- Add migration script here
ALTER TABLE product_variants
ADD COLUMN cost DECIMAL(12,2) NOT NULL;

ALTER TABLE products
DROP COLUMN brand;