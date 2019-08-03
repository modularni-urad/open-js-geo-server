import initLayerRoutes from './api/layers'
import initPolygonRoutes from './api/polygons'

export default (app, knex, auth, bodyParser) => {
  //
  initLayerRoutes(app, knex, auth, bodyParser)

  initPolygonRoutes(app, knex, auth, bodyParser.json())
}
