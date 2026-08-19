import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { healthRouter } from './routes/health.js'
import { iaRouter } from './routes/ia/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.corsOrigin }))
  app.use(express.json())
  app.use(morgan('dev'))

  app.use('/health', healthRouter)
  app.use('/ia', iaRouter)

  app.use(errorHandler)

  return app
}
