/**
 * This module sets up a PostgreSQL client using the `pg` library and exports a connection pool for use in the application.
 * It reads the database configuration from the `DB_CONFIG` object and initializes a connection pool with the specified settings.
 * The pool is configured to handle a maximum number of connections as defined in the configuration.
 * Additionally, it listens for any unexpected errors on the pool and logs them to the console.
 */
import { Pool } from 'pg'

import { DB_CONFIG } from '../../config/db.config.js'

export const db = new Pool({
  connectionString: DB_CONFIG.connectionString,
  max: DB_CONFIG.maxConnections,
})

db.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error)
})
