import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import initErrorHandlers from './error_handlers'
import { initAuth, getUid, authRequired } from './auth'
import initDB from './db'
import InitApps from './index'

async function init (host, port) {
  const knex = await initDB()
  const app = express()
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
    auth: { getUid, required: authRequired },
    JSONBodyParser
  }
  const apps = InitApps(appContext)
  app.use('/layers', apps.layers)
  app.use('/objs', apps.objects)

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
