-- Add migration script here

-- Drop old tables 
DROP TABLE public.product_images CASCADE;

DROP TABLE public.product_review_attachments CASCADE;

DROP TABLE public.product_reviews CASCADE;

DROP TABLE public.product_variants CASCADE;

DROP TABLE public.products CASCADE;


CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    shop_id BIGINT NOT NULL REFERENCES shops(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(255),
    global_category_id BIGINT, -- FK and force not null later on future migration
    shop_category_id BIGINT, -- FK and force not null later on future migration
    has_variants BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP -- Soft deletion 
);

CREATE TABLE product_specifications (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    name VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP -- Soft deletion 
);

CREATE TABLE attributes (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    name VARCHAR(100) NOT NULL,
    deleted_at TIMESTAMP, -- Soft deletion 
    UNIQUE(product_id, name)
);

CREATE TABLE attribute_options (
    id BIGINT PRIMARY KEY,
    attribute_id BIGINT NOT NULL REFERENCES attributes(id),
    value VARCHAR(100) NOT NULL,
    UNIQUE(attribute_id, value),
    deleted_at TIMESTAMP -- Soft deletion 
);

CREATE TABLE product_variants (
    id BIGINT PRIMARY KEY,
    shop_id BIGINT NOT NULL REFERENCES shops(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    sku VARCHAR(100) NOT NULL,
    nsin VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(12,2) NOT NULL,

    on_sale BOOLEAN DEFAULT FALSE,
    sale_price DECIMAL(12,2),

    stock_quantity INTEGER NOT NULL DEFAULT 0,
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP, -- Soft deletion

    UNIQUE (shop_id, sku)
);

CREATE TABLE variant_attribute_values (
    variant_id BIGINT NOT NULL REFERENCES product_variants(id),
    attribute_option_id BIGINT NOT NULL REFERENCES attribute_options(id),
    PRIMARY KEY (variant_id, attribute_option_id)
);

CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_attributes_product_id ON attributes(product_id);
CREATE INDEX idx_options_attribute_id ON attribute_options(attribute_id);
-- IDX later