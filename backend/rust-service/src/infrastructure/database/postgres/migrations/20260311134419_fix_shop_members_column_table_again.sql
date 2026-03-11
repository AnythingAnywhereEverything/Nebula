-- Add migration script here
ALTER TABLE shop_members DROP COLUMN "role";
ALTER TABLE shop_members ADD COLUMN "role_id" BIGINT NOT NULL;
ALTER TABLE shop_members ADD CONSTRAINT fk_shop_roles FOREIGN KEY (role_id) REFERENCES shop_roles(id);