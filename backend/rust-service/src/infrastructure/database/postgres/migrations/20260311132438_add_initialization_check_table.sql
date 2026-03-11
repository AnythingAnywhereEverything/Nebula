-- Add migration script here
CREATE TABLE initialization (
    value TEXT,
    is_success BOOLEAN
);

INSERT INTO initialization (value, is_success)
VALUES ('has_superuser', FALSE);