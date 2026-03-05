-- * Drop old UNIQUE constraints
ALTER TABLE attribute_options
DROP CONSTRAINT attribute_options_attribute_id_value_key;

ALTER TABLE product_variants
DROP CONSTRAINT product_variants_shop_id_sku_key;

-- * Recreate them as partial unique indexes (ignore soft deleted rows)

CREATE UNIQUE INDEX attribute_options_unique_active
ON attribute_options (attribute_id, value)
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX product_variants_shop_sku_unique_active
ON product_variants (shop_id, sku)
WHERE deleted_at IS NULL;