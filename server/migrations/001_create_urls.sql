
/**
* This SQL script creates the `urls` table if it does not already exist.
* The `urls` table is used to store the mapping between short codes and original URLs.
* It contains several columns to track the URL information and metadata.
* The `id` column is defined as a primary key and is auto-incremented.
* The `short_code` column is a unique identifier for the shortened URL and is defined as a unique constraint.
* The `original_url` column stores the original URL that the short code maps to.
* The `expires_at` column is an optional timestamp that indicates when the short code will
expire.
* The `created_at` and `updated_at` columns are timestamps that record when the record was created and last updated, respectively.
*/
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,

    short_code VARCHAR(30) NOT NULL UNIQUE,

    original_url TEXT NOT NULL,

    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_urls_expires_at
    ON urls (expires_at);

CREATE INDEX idx_urls_created_at
    ON urls (created_at DESC);