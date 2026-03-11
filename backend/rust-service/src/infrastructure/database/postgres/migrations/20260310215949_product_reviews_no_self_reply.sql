-- Add migration script here
ALTER TABLE product_reviews
ADD CONSTRAINT product_reviews_no_self_reply
CHECK (parent_id IS NULL OR parent_id <> id);