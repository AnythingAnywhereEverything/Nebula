-- Add migration script here
ALTER TABLE product_images
ADD COLUMN position INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX product_images_product_position_idx
ON product_images(product_id, position)
WHERE product_id IS NOT NULL;

CREATE UNIQUE INDEX product_images_variant_position_idx
ON product_images(variant_id, position)
WHERE variant_id IS NOT NULL;