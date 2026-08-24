/**
 * This script is responsible for running database migrations.
 * It reads SQL migration files from the migrations directory,
 * checks if they have already been applied, and if not, applies them to the database.
 * It also keeps track of applied migrations in a schema_migrations table.
 */
import 'dotenv/config'

import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { db } from './client.js'

const migrationsDirectory = fileURLToPath(new URL('../../../migrations', import.meta.url))

const runMigrations = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  const files = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const { rows } = await db.query<{ version: string }>(
      `
        SELECT version
        FROM schema_migrations
        WHERE version = $1
      `,
      [file],
    )

    if (rows.length > 0) {
      continue
    }

    const migration = await readFile(join(migrationsDirectory, file), 'utf8')

    const client = await db.connect()

    try {
      await client.query('BEGIN')

      await client.query(migration)

      await client.query(
        `
          INSERT INTO schema_migrations (version)
          VALUES ($1)
        `,
        [file],
      )

      await client.query('COMMIT')

      console.log(`Applied migration: ${file}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  console.log('Migrations completed')
}

try {
  await runMigrations()
} catch (error) {
  console.error('Migration failed', error)
  process.exitCode = 1
} finally {
  await db.end()
}
