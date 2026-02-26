-- Add migration script here

-- add phone_number, address_line1 and address_line2 to addresses table
ALTER TABLE addresses
ADD COLUMN phone_number VARCHAR(20) NOT NULL,
ADD COLUMN address_line1 VARCHAR(255) NOT NULL,
ADD COLUMN address_line2 VARCHAR(255),
ADD COLUMN full_name VARCHAR(255) NOT NULL,
DROP COLUMN street;

-- add index on addresses table of user_id with id to speed up queries
CREATE INDEX idx_addresses_user_id ON addresses (user_id, id);

-- add index user_id 
CREATE INDEX idx_addresses_user_id_only ON addresses (user_id);