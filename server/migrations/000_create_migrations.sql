/**
* This SQL script creates the `schema_migrations` table if it does not already exist.
* The `schema_migrations` table is used to track which migrations have been applied to the database.
* It contains two columns: `version`, which stores the version of the migration, and `applied_at`, which records the timestamp when the migration was applied.
* The `version` column is defined as a primary key to ensure that each migration version is unique.
*/
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);