import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import { initAuth, getUid, required } from 'modularni-urad-utils/auth'
import initDB from './db'
import InitApp from './index'

async function init (host, port) {
  const knex = await initDB()
  const app = express()
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'short' : 'dev'))
  const MAXBODYSIZE = process.env.MAXBODYSIZE || '10mb'
  const JSONBodyParser = bodyParser.json({ limit: MAXBODYSIZE })

  process.env.ORIGIN_URL && app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
    preflightContinue: false
  }))

  initAuth(app)

  const appContext = {
    express,
    knex,
    auth: { getUid, required },
    JSONBodyParser
  }
  app.use(InitApp(appContext))

  initErrorHandlers(app) // ERROR HANDLING
  app.listen(port, host, (err) => {
    if (err) throw err
    console.log(`frodo do magic on ${host}:${port}`)
  })
}

try {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT
  init(host, port)
} catch (err) {
  console.error(err)
}
