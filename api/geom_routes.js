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
      .select('id', 'properties', knex.st.asText('polygon'), knex.st.asText('point'))
      .then(info => {
        res.json(info)
        next()
      })
      .catch(next)
  })

  function _setGeom (data, body) {
    const g = knex.st.setSRID(knex.st.geomFromGeoJSON(body.geometry), SRID)
    switch (body.geometry.type) {
      case 'Polygon':
        data.polygon = g
        break
      case 'Point':
        data.point = g
        break
    }
  }

  async function saveFeature (req) {
    const data = {
      owner: req.user.id,
      layerid: req.params.layerid,
      properties: req.body.properties
    }
    _setGeom(data, req.body)
    return await knex(TNAMES.OBJECTS).returning('id').insert(data)
  }

  async function saveFeatureCollection (req) {
    const trxProvider = knex.transactionProvider()
    const trx = await trxProvider()
    try {
      req.body.map(i => {
        i.point = knex.st.setSRID(knex.st.geomFromGeoJSON(i.point), SRID)
        i.owner = req.user.id
        i.layerid = req.params.layerid
      })
      const ids = await trx(TNAMES.OBJECTS).insert(req.body)
      await trx.commit()
      return ids
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  app.post('/:layerid([0-9]+)/', auth.MWare, checkWriteMW, bodyParser, async (req, res, next) => {
    try {
      let rval = null
      switch (req.body.type) {
        case 'Feature':
          rval = await saveFeature(req)
          break
        case 'FeatureCollection':
          rval = await saveFeatureCollection(req)
          break
        default:
          return next('wrong GeoJSON')
      }
      res.status(201).json(rval)
    } catch (err) {
      next(err)
    }
  })

  app.put('/:layerid([0-9]+)/:id([0-9]+)', auth.MWare, checkWriteMW, bodyParser, (req, res, next) => {
    const change = {}
    req.body.geometry && _setGeom(change, req.body)
    req.body.properties && Object.assign(change, { properties: req.body.properties })
    const query = { id: req.params.id, layerid: req.params.layerid }
    knex(TNAMES.OBJECTS).where(query).update(change)
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })

  app.delete('/:layerid([0-9]+)/:id([0-9]+)', auth.MWare, checkWriteMW, (req, res, next) => {
    const query = { id: req.params.id, layerid: req.params.layerid }
    knex(TNAMES.OBJECTS).where(query).del()
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })
}
