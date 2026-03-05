-- * remove old constraint
ALTER TABLE attributes
DROP CONSTRAINT attributes_product_id_name_key;

-- * create partial unique index
CREATE UNIQUE INDEX attributes_unique_active_name
ON attributes(product_id, name)
WHERE deleted_at IS NULL;