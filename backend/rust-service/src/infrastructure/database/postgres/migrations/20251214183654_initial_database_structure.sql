-- id created using snowflake algorithm using postgres

-- cretae address table
CREATE TABLE addresses (
    id bigint PRIMARY KEY NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- create roles table
CREATE TABLE roles (
    id bigint PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions bigint NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE
);

-- create role_permissions let super user create all permissions
CREATE TABLE role_permissions (
    name TEXT PRIMARY KEY NOT NULL,
    description TEXT,
    bit_position bigint UNIQUE NOT NULL
);

-- create users table
CREATE TABLE users (
    -- Essential user fields
    id bigint PRIMARY KEY NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    -- Automatic timestamp fields
    role_id bigint,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_login_at TIMESTAMP,
    -- Optional or personalization fields
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    default_shipping_address_id bigint,
    ml_interest_vector TEXT[],
    CONSTRAINT fk_default_shipping_address
        FOREIGN KEY(default_shipping_address_id)
            REFERENCES addresses(id),
    CONSTRAINT fk_role
        FOREIGN KEY(role_id)
            REFERENCES roles(id)
);

-- create sessions table
CREATE TABLE sessions (
    id bigint PRIMARY KEY NOT NULL,
    user_id bigint NOT NULL,
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    agent TEXT,
    ip_address TEXT,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);

-- create password_reset_tokens table
CREATE TABLE password_reset_tokens (
    id bigint PRIMARY KEY NOT NULL,
    user_id bigint NOT NULL,
    token TEXT UNIQUE NOT NULL,
    -- Token expiration timestamp 15 minutes from creation
    expires_at TIMESTAMP NOT NULL DEFAULT (now() + INTERVAL '15 minutes'),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);

-- create email_verification_tokens table
CREATE TABLE email_verification_tokens (
    id bigint PRIMARY KEY NOT NULL,
    user_id bigint NOT NULL,
    token TEXT UNIQUE NOT NULL,
    -- Token expiration timestamp 24 hours from creation
    expires_at TIMESTAMP NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);

-- create market table
CREATE TABLE markets (
    id bigint PRIMARY KEY NOT NULL,
    owner_id bigint NOT NULL,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    currency_code TEXT NOT NULL,
    is_brand_market BOOLEAN NOT NULL DEFAULT FALSE,
    locale TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_owner
        FOREIGN KEY(owner_id)
            REFERENCES users(id)
);

-- create market_config table (Configuration for storefront layout)
CREATE TABLE market_config (
    market_id bigint PRIMARY KEY NOT NULL,
    theme_color TEXT,
    logo_url TEXT,
    
    -- JSONB for flexible layout structure (e.g., defining components and their order)
    storefront_layout JSONB NOT NULL DEFAULT '{}'::jsonb, 
    
    CONSTRAINT fk_market
        FOREIGN KEY(market_id)
            REFERENCES markets(id)
);

-- create market_role table
CREATE TABLE market_roles (
    id bigint PRIMARY KEY NOT NULL,
    market_id bigint NOT NULL,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions bigint NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_market
        FOREIGN KEY(market_id)
            REFERENCES markets(id)
);

-- create market_permissions table
CREATE TABLE market_permissions (
    name TEXT PRIMARY KEY NOT NULL,
    description TEXT,
    bit_position bigint UNIQUE NOT NULL
);

-- create market_invitations table
CREATE TABLE market_invitations (
    id bigint PRIMARY KEY NOT NULL,
    market_id bigint NOT NULL,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (now() + INTERVAL '7 days'),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_market
        FOREIGN KEY(market_id)
            REFERENCES markets(id)
);

-- create market_members table
CREATE TABLE market_members (
    id bigint PRIMARY KEY NOT NULL,
    market_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_market
        FOREIGN KEY(market_id)
            REFERENCES markets(id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);

-- create products table
CREATE TABLE products (
    id bigint PRIMARY KEY NOT NULL,
    market_id bigint NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,

    -- Status field
    on_promotion BOOLEAN NOT NULL DEFAULT FALSE,
    promotion_price NUMERIC(10, 2),
    promotion_start TIMESTAMP,
    promotion_end TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Automatic timestamp fields
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_market
        FOREIGN KEY(market_id)
            REFERENCES markets(id)
);

-- create product_variants table
CREATE TABLE product_variants (
    id bigint PRIMARY KEY NOT NULL,
    product_id bigint NOT NULL,
    name TEXT NOT NULL,
    additional_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES products(id)
);

-- create product_images table
CREATE TABLE product_images (
    id bigint PRIMARY KEY NOT NULL,
    product_id bigint NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES products(id)
);

-- create product_reviews table
CREATE TABLE product_reviews (
    id bigint PRIMARY KEY NOT NULL,
    product_id bigint NOT NULL,
    user_id bigint NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    likes INTEGER NOT NULL DEFAULT 0,
    dislikes INTEGER NOT NULL DEFAULT 0,
    review_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES products(id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);

-- create product_review_attachments table
CREATE TABLE product_review_attachments (
    id bigint PRIMARY KEY NOT NULL,
    review_id bigint NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    CONSTRAINT fk_review
        FOREIGN KEY(review_id)
            REFERENCES product_reviews(id)
);

-- create cart table
CREATE TABLE carts (
    product_id bigint NOT NULL,
    product_variants_id bigint,
    user_id bigint NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT pk_cart PRIMARY KEY (product_id, product_variants_id, user_id),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES products(id),
    CONSTRAINT fk_product_variant
        FOREIGN KEY(product_variants_id)
            REFERENCES product_variants(id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);

-- create wishlist table
CREATE TABLE wishlists (
    product_id bigint NOT NULL,
    user_id bigint NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT pk_wishlist PRIMARY KEY (product_id, user_id),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES products(id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);

-- create orders table
CREATE TABLE orders (
    id bigint PRIMARY KEY NOT NULL,
    user_id bigint NOT NULL,
    market_id bigint NOT NULL,
    
    -- Order state management
    status TEXT NOT NULL, -- e.g., 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
    
    -- Financial summary
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency_code TEXT NOT NULL,
    
    -- Shipping and billing addresses (use copies of the addresses table for immutability)
    shipping_address_id bigint NOT NULL,
    billing_address_id bigint NOT NULL,
    
    -- Automatic timestamp fields
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id),
    CONSTRAINT fk_market
        FOREIGN KEY(market_id)
            REFERENCES markets(id),
    CONSTRAINT fk_shipping_address
        FOREIGN KEY(shipping_address_id)
            REFERENCES addresses(id),
    CONSTRAINT fk_billing_address
        FOREIGN KEY(billing_address_id)
            REFERENCES addresses(id)
);

-- create order_items table (The line items for each order)
CREATE TABLE order_items (
    id bigint PRIMARY KEY NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    product_variant_id bigint,
    
    -- Snapshot data
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL, 
    item_tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    item_total NUMERIC(10, 2) NOT NULL, -- quantity * unit_price
    
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_order
        FOREIGN KEY(order_id)
            REFERENCES orders(id),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES products(id),
    CONSTRAINT fk_product_variant
        FOREIGN KEY(product_variant_id)
            REFERENCES product_variants(id)
);

-- create order_history table (Audit log for state changes)
CREATE TABLE order_history (
    id bigint PRIMARY KEY NOT NULL,
    order_id bigint NOT NULL,
    old_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    actor_id bigint, -- The user or system that changed the status
    reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_order
        FOREIGN KEY(order_id)
            REFERENCES orders(id),
    CONSTRAINT fk_actor
        FOREIGN KEY(actor_id)
            REFERENCES users(id) -- Allows tracking if a market employee changed the status
);

-- create user_interactions table
CREATE TABLE user_interactions (
    id bigint PRIMARY KEY NOT NULL,
    user_id bigint NOT NULL,
    -- The type of action (e.g., 'SEARCH', 'VIEW', 'CLICK', 'FAVORITE')
    action_type TEXT NOT NULL, 
    -- ID of the item related to the action (e.g., product_id, market_id)
    target_id bigint,
    -- If the action was a search, store the query text
    search_query TEXT, 
    -- Contextual data (e.g., source page, referrer)
    context_data JSONB, 
    -- Timestamp for the interaction (For ML model training)
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);

-- create payments table (Money coming IN from customers)
CREATE TABLE payments (
    id bigint PRIMARY KEY NOT NULL,
    order_id bigint NOT NULL UNIQUE, -- One payment per order
    
    -- Status and amount
    amount NUMERIC(10, 2) NOT NULL,
    currency_code TEXT NOT NULL,
    status TEXT NOT NULL, -- e.g., 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'
    
    -- Gateway reference (Stripe, PayPal, etc.)
    gateway_transaction_id TEXT UNIQUE NOT NULL, 
    
    -- Idempotency key to ensure the payment is only processed once
    idempotency_key TEXT UNIQUE NOT NULL, 
    
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_order
        FOREIGN KEY(order_id)
            REFERENCES orders(id)
);

-- create payouts table (Money going OUT to market owners)
CREATE TABLE payouts (
    id bigint PRIMARY KEY NOT NULL,
    market_id bigint NOT NULL,
    
    -- Status and amount
    amount NUMERIC(10, 2) NOT NULL,
    currency_code TEXT NOT NULL,
    status TEXT NOT NULL, -- e.g., 'REQUESTED', 'PENDING', 'PAID', 'FAILED'
    
    -- Financial audit details
    commission_paid NUMERIC(10, 2) NOT NULL, -- Commission deducted by our platform
    net_amount NUMERIC(10, 2) NOT NULL, -- Amount actually sent to the market (amount - commission)
    
    -- Gateway reference (e.g., bank transfer reference ID)
    gateway_payout_id TEXT UNIQUE, 
    
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_market
        FOREIGN KEY(market_id)
            REFERENCES markets(id)
);

-- create idempotency_keys table (The central idempotent ledger)
CREATE TABLE idempotency_keys (
    key TEXT PRIMARY KEY NOT NULL,
    request_type TEXT NOT NULL, -- e.g., 'PAYMENT_CAPTURE', 'ORDER_CREATE', 'PAYOUT_REQUEST'
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    locked_until TIMESTAMP, -- Optional: For ensuring no two processes use the key simultaneously
    response_code INTEGER,
    response_body JSONB
);

-- Performance Indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_gateway_id ON payments(gateway_transaction_id);
CREATE INDEX idx_payouts_market_id ON payouts(market_id);
CREATE INDEX idx_idempotency_key_created ON idempotency_keys(created_at);
CREATE INDEX idx_interactions_user_id ON user_interactions(user_id); 
CREATE INDEX idx_interactions_action_type ON user_interactions(action_type);
CREATE INDEX idx_interactions_user_action_time ON user_interactions(user_id, action_type, created_at);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_market_id ON orders(market_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_history_order_id ON order_history(order_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_products_market_id ON products(market_id);
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_market_members_market_id ON market_members(market_id);
CREATE INDEX idx_market_members_user_id ON market_members(user_id);