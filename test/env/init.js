import express from 'express'
import dbinit from './dbinit'
import { initErrorHandlers, APIError } from 'modularni-urad-utils'
import { attachPaginate } from 'knex-paginate'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')

module.exports = (g) => {
  process.env.NODE_ENV = 'test'
  process.env.SESSION_SERVICE_PORT = 24000
  process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
  
  const port = process.env.PORT || 3333
  Object.assign(g, {
    port,
    baseurl: `http://localhost:${port}`,
    mockUser: { id: 42 },
    sessionBasket: []
  })
  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)

  g.InitApp = async function (ApiModule) {
    const auth = require('modularni-urad-utils/auth').default
    const knex = g.knex = await dbinit()
    attachPaginate()
    await ApiModule.migrate(knex)

    const app = express()
    const appContext = { 
      express, knex, auth, 
      bodyParser: express.json(),
      ErrorClass: APIError
    }
    const mwarez = ApiModule.init(appContext)
    app.use(mwarez)

    initErrorHandlers(app)

    return new Promise((resolve, reject) => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  g.close = async function() {
    const cleanupDB = require('./dbcleanup').default
    await cleanupDB(g.knex)
    g.sessionSrvcMock.close()
    g.server.close()
  }
}