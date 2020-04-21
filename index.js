import initLayerRoutes from './api/layers'
import initGeometryRoutes from './api/geom_routes'

export default (ctx) => {
  //
  const layers = ctx.express()
  initLayerRoutes(layers, ctx.knex, ctx.auth, ctx.JSONBodyParser)

  const objects = ctx.express()
  initGeometryRoutes(objects, ctx.knex, ctx.auth, ctx.JSONBodyParser)

  return { layers, objects }
}
