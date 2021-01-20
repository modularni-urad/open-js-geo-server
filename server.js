import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import initAuth from 'modularni-urad-utils/auth'
import initDB from './db'
import InitApp from './index'

async function init (host, port) {
  const knex = await initDB()
  const app = express()
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'short' : 'dev'))
  const MAXBODYSIZE = process.env.MAXBODYSIZE || '10mb'
  const JSONBodyParser = bodyParser.json({ limit: MAXBODYSIZE })

  const auth = initAuth(app)

  const appContext = { express, knex, auth, JSONBodyParser }
  app.use(InitApp(appContext))

  initErrorHandlers(app) // ERROR HANDLING
  app.listen(port, host, (err) => {
    if (err) throw err
    console.log(`frodo do magic on ${host}:${port}`)
  })
}

try {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000
  init(host, port)
} catch (err) {
  console.error(err)
}
