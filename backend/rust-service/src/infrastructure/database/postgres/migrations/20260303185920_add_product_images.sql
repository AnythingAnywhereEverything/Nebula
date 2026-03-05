-- Add migration script here

CREATE TABLE product_images (
    id BIGINT PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    variant_id BIGINT REFERENCES product_variants(id),

    image_url TEXT NOT NULL,

    CHECK (
        (product_id IS NOT NULL AND variant_id IS NULL)
        OR (product_id IS NULL AND variant_id IS NOT NULL)
    )
);

CREATE TABLE product_reviews (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),

    parent_id BIGINT REFERENCES product_reviews(id) ON DELETE CASCADE, -- null = root review, and in case of hard deletion

    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL, -- nullable if user deleted

    rating INTEGER CHECK (
        (parent_id IS NULL AND rating IS NOT NULL AND rating BETWEEN 1 AND 5)
        OR (parent_id IS NOT NULL AND rating IS NULL)
    ),

    content TEXT NOT NULL,

    likes INTEGER NOT NULL DEFAULT 0,
    dislikes INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP -- soft delete
);

CREATE TYPE reaction_type AS ENUM ('like', 'dislike', 'none');

-- keep for user logged data
CREATE TABLE review_reactions (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL, -- no FK
    review_id BIGINT NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
    reaction reaction_type NOT NULL,

    UNIQUE (user_id, review_id)
);

CREATE TABLE review_images (
    id BIGINT PRIMARY KEY,
    review_id BIGINT NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_parent_id ON product_reviews(parent_id);
CREATE INDEX idx_review_reactions_review_id ON review_reactions(review_id);
CREATE INDEX idx_review_images_review_id ON review_images(review_id);