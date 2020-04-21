import layers from './api/layers'
import initGeometryRoutes from './api/geom_routes'

export default (ctx) => {
  const { auth, JSONBodyParser, knex } = ctx
  const layerApp = ctx.express()

  layers.get('/:id([0-9]+)', (req, res, next) => {
    try {
      res.json(layers.detail(req.params.id, knex))
    } catch (err) { next(err) }
  })

  layerApp.get('/', (req, res, next) => {
    try {
      res.json(layers.list(req.query, knex))
    } catch (err) { next(err) }
  })

  layerApp.post('/', auth.required, JSONBodyParser, (req, res, next) => {
    try {
      res.status(201).json(layers.create(req.body, auth.getUid(req), knex))
    } catch (err) { next(err) }
  })

  layerApp.put('/:id([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    try {
      res.json(layers.modify(req.params.id, req.body, knex))
    } catch (err) { next(err) }
  })

  const objectsApp = ctx.express()
  initGeometryRoutes(objectsApp, knex, auth, JSONBodyParser)

  return { layers: layerApp, objects: objectsApp }
}
