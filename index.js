import layerRoutes from './api/layer_routes'
import geomRoutes from './api/geom_routes'

export default (ctx) => {
  return {
    layers: layerRoutes(ctx),
    objects: geomRoutes(ctx)
  }
}
