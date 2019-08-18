import _ from 'underscore'
import { TNAMES } from '../consts'

export default (app, knex, auth, bodyParser) => {
  //
  function checkWriteMW (req, res, next) {
    knex(TNAMES.LAYERS).where({ id: req.params.layerid || null }).first()
      .then(layer => {
        if (!layer) throw new Error(404)
        function _amongWriters () {
          _.find(layer.writers.split(','), req.user.id)
        }
        // we are not owner nor among writers
        if (layer.owner !== req.user.id && !_amongWriters()) {
          throw new Error(401)
        }
        next()
      })
      .catch(next)
  }

  app.get('/', (req, res, next) => {
    // const q = req.query
    knex(TNAMES.POLYGONS).select('id', 'title', 'link', knex.st.asText('geom'))
      .then(info => {
        res.json(info)
        next()
      })
      .catch(next)
  })

  app.post(`/:layerid([0-9]+)/`, auth.MWare, checkWriteMW, bodyParser, (req, res, next) => {
    Object.assign(req.body, { owner: req.user.id, layerid: req.params.layerid })
    req.body.geom = knex.st.setSRID(knex.st.geomFromGeoJSON(req.body.geom), 4326)
    knex(TNAMES.POLYGONS).returning('id').insert(req.body)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  app.put(`/:layerid([0-9]+)/:id([0-9]+)`, auth.MWare, checkWriteMW, bodyParser, (req, res, next) => {
    if (req.body.geom) {
      req.body.geom = knex.st.setSRID(knex.st.geomFromGeoJSON(req.body.geom), 4326)
    }
    const change = _.omit(req.body, ['id', 'created', 'geomtype', 'owner', 'layerid'])
    const query = { id: req.params.id, layerid: req.params.layerid }
    knex(TNAMES.POLYGONS).where(query).update(change)
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })

  app.delete(`/:layerid([0-9]+)/:id([0-9]+)`, auth.MWare, checkWriteMW, (req, res, next) => {
    const query = { id: req.params.id, layerid: req.params.layerid }
    knex(TNAMES.POLYGONS).where(query).del()
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })
}
