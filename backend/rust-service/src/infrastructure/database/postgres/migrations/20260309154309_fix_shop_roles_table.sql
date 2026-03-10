-- Add migration script here
ALTER TABLE shop_roles
DROP CONSTRAINT market_roles_name_key;

ALTER TABLE shop_roles
ADD CONSTRAINT shop_roles_shop_id_name_key
UNIQUE (shop_id, name);