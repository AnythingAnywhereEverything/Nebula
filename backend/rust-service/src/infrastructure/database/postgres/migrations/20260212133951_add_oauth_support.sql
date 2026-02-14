ALTER TABLE users
    ALTER COLUMN password_hash DROP NOT NULL;

CREATE TABLE oauth_accounts (
    id BIGINT PRIMARY KEY,

    user_id BIGINT NOT NULL,
    provider TEXT NOT NULL,
    provider_user_id TEXT NOT NULL,

    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

    CONSTRAINT oauth_provider_unique
        UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_user_id
    ON oauth_accounts(user_id);

CREATE INDEX idx_oauth_provider
    ON oauth_accounts(provider);