require('dotenv').config()
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import InitApp from './index'
import {generalErrorHlr, authErrorHlr, notFoundErrorHlr} from './error_handlers'
import { initApp } from './auth'
const initDB = require('./db')
const port = process.env.PORT

function initExpressApp (knex) {
  const app = express()
  process.env.ORIGIN_URL && app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
    preflightContinue: false
  }))

  initApp(app)

  const MAXBODYSIZE = process.env.MAXBODYSIZE || '10mb'
  InitApp(app, express, knex, bodyParser.json({ limit: MAXBODYSIZE }))

  // ERROR HANDLING ------------------------------------------------------------
  app.use(notFoundErrorHlr, authErrorHlr, generalErrorHlr)
  // ---------------------------------------------------------------------------
  return app
}

// ENTRY point
initDB()
  .then(knex => {
    const app = initExpressApp(knex)
    app.listen(port, (err) => {
      if (err) {
        throw err
      }
      console.log(`frodo do magic on ${port}`)
    })
  })
  .catch(err => {
    console.error(err)
  })
