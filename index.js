import initLayerRoutes from './api/layers'
import initGeometryRoutes from './api/geom_routes'
import { getUid, authRequired } from './auth'
import { TNAMES } from './consts'

const auth = { getUid, authRequired }

export default (app, express, knex, bodyParser) => {
  //
  const layers = express()
  initLayerRoutes(layers, knex, auth, bodyParser)
  app.use(`/${TNAMES.LAYERS}`, layers)

  const objects = express()
  initGeometryRoutes(objects, knex, auth, bodyParser)
  app.use('/objs', objects)
}
