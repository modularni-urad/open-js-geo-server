import { detail, list, create, modify } from './layers'
import geomRoutes from './geom_routes'

export default (ctx) => {
  const { auth, bodyParser, knex } = ctx
  const layerApp = ctx.express()
  const geomApp = geomRoutes(ctx)

  layerApp.use('/objects', geomApp)

  layerApp.get('/:id([0-9]+)', async (req, res, next) => {
    try {
      res.json(await detail(req.params.id, knex, req.tenantid))
    } catch (err) { next(err) }
  })

  layerApp.get('/', async (req, res, next) => {
    try {
      res.json(await list(req.query, knex, req.tenantid))
    } catch (err) { next(err) }
  })

  layerApp.post('/', auth.session, auth.required, bodyParser, async (req, res, next) => {
    try {
      res.status(201).json(await create(req.body, auth.getUID(req), knex, req.tenantid))
    } catch (err) { next(err) }
  })

  layerApp.put('/:id([0-9]+)', auth.session, auth.required, 
    bodyParser, async (req, res, next) => {
      try {
        res.json(await modify(req.params.id, req.body, knex, req.tenantid))
      } catch (err) { next(err) }
    })
  return layerApp
}
