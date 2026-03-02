-- Add migration script here
-- refactor shop table, renamed markets to shops
ALTER TABLE markets RENAME TO shops;
ALTER TABLE market_config RENAME TO shop_configs;
ALTER TABLE market_invitations RENAME TO shop_invitations;
ALTER TABLE market_members RENAME TO shop_members;
ALTER TABLE market_permissions RENAME TO shop_permissions;
ALTER TABLE market_roles RENAME TO shop_roles;

ALTER TABLE shops RENAME COLUMN is_brand_market TO is_brand;

-- change market_id to shop_id in related tables
ALTER TABLE shop_configs RENAME COLUMN market_id TO shop_id;
ALTER TABLE shop_invitations RENAME COLUMN market_id TO shop_id;
ALTER TABLE shop_members RENAME COLUMN market_id TO shop_id;
ALTER TABLE shop_roles RENAME COLUMN market_id TO shop_id;

ALTER TABLE shops
DROP COLUMN locale,
DROP COLUMN currency_code;

-- seed permissions
INSERT INTO shop_permissions (name, description, bit_position) VALUES
('manage_shop', 'Permission to manage shop settings and configurations', 0),
('manage_products', 'Permission to manage products in the shop', 1),
('manage_orders', 'Permission to manage orders in the shop', 2),
('manage_customers', 'Permission to manage customers in the shop', 3),
('view_reports', 'Permission to view sales and performance reports for the shop', 4);