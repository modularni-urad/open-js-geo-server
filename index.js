import initLayerRoutes from './api/layers'
import initGeometryRoutes from './api/geom_routes'
import { TNAMES } from './consts'

export default (app, express, knex, auth, bodyParser) => {
  //
  const layers = express()
  initLayerRoutes(layers, knex, auth, bodyParser)
  app.use(`/${TNAMES.LAYERS}`, layers)

  const objects = express()
  initGeometryRoutes(objects, knex, auth, bodyParser)
  app.use('/objs', objects)
}
