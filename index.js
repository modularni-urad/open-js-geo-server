import initLayerRoutes from './api/layers'
import initPolygonRoutes from './api/polygons'
import { TNAMES } from './consts'

export default (app, express, knex, auth, bodyParser) => {
  //
  const layers = express()
  initLayerRoutes(layers, knex, auth, bodyParser)
  app.use(`/${TNAMES.LAYERS}`, layers)

  const polys = express()
  initPolygonRoutes(polys, knex, auth, bodyParser.json())
  app.use(`/${TNAMES.POLYGONS}`, polys)
}
