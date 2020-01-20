import _ from 'underscore'
import { TNAMES, SRID } from '../consts'

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
    knex(TNAMES.OBJECTS)
      .select('id', 'title', 'link', 'image', 'descr', knex.st.asText('polygon'), knex.st.asText('point'))
      .then(info => {
        res.json(info)
        next()
      })
      .catch(next)
  })

  function _setGeom (body) {
    body.polygon = body.point = null
    const g = knex.st.setSRID(knex.st.geomFromGeoJSON(body.geometry), SRID)
    switch (body.geometry.type) {
      case 'Polygon':
        body.polygon = g
        break
      case 'Point':
        body.point = g
        break
    }
    delete body.geometry
  }

  app.post(`/:layerid([0-9]+)/`, auth.MWare, checkWriteMW, bodyParser, (req, res, next) => {
    Object.assign(req.body, { owner: req.user.id, layerid: req.params.layerid })
    _setGeom(req.body)
    knex(TNAMES.OBJECTS).returning('id').insert(req.body)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  app.put(`/:layerid([0-9]+)/:id([0-9]+)`, auth.MWare, checkWriteMW, bodyParser, (req, res, next) => {
    if (req.body.geometry) {
      _setGeom(req.body)
    }
    const change = _.omit(req.body, ['id', 'created', 'owner', 'layerid'])
    const query = { id: req.params.id, layerid: req.params.layerid }
    knex(TNAMES.OBJECTS).where(query).update(change)
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })

  app.delete(`/:layerid([0-9]+)/:id([0-9]+)`, auth.MWare, checkWriteMW, (req, res, next) => {
    const query = { id: req.params.id, layerid: req.params.layerid }
    knex(TNAMES.OBJECTS).where(query).del()
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })
}
