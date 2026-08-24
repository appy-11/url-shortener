const port = Number(process.env.PORT ?? 3000)

if (Number.isNaN(port)) {
  throw new Error('PORT must be a valid number')
}

export const APP_CONFIG = {
  name: 'Shortly API',
  port,
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const
