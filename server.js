require('dotenv').config()
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import InitApp from './index'
import {generalErrorHlr, authErrorHlr, notFoundErrorHlr} from './error_handlers'
import auth from './auth'
const initDB = require('./db')
const port = process.env.PORT

function initExpressApp (knex) {
  const app = express()
  process.env.USE_CORS === 'true' && app.use(cors())

  InitApp(app, knex, auth, bodyParser)

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
