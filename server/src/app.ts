import express from 'express'
import cors from 'cors'

import { errorMiddleware } from './middleware/error.middleware.js'

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  }),
)

app.use(express.json())

app.get('/health', (_request, response) => {
  response.status(200).json({
    status: 'ok',
  })
})

app.use(errorMiddleware)

export default app
