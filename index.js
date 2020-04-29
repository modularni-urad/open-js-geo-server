import layerRoutes from './api/layer_routes'
import geomRoutes from './api/geom_routes'

export default (ctx) => {
  const app = ctx.express()

  app.use('/layers', layerRoutes(ctx))
  app.use('/objs', geomRoutes(ctx))

  return app
}
