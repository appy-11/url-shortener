import app from './app.js'
import { APP_CONFIG } from './config/app.config.js'

app.listen(APP_CONFIG.port, () => {
  console.log(`${APP_CONFIG.name} running on port ${APP_CONFIG.port}`)
})
