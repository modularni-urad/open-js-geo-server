import _ from 'underscore'
import { whereFilter } from 'knex-filter-loopback'
import { TNAMES, SRID } from '../consts'

export default (app, knex, auth, bodyParser) => {
  //
  function checkWriteMW (req, res, next) {
    const UID = auth.getUid(req)
    knex(TNAMES.LAYERS).where({ id: req.params.layerid || null }).first()
      .then(layer => {
        if (!layer) throw new Error(404)
        function _amongWriters () {
          return layer.writers === '*' || _.find(layer.writers.split(','), UID)
        }
        // we are not owner nor among writers
        if (layer.owner === UID || _amongWriters()) {
          return next()
        }
        throw new Error(401)
      })
      .catch(next)
  }

  app.get('/', (req, res, next) => {
    knex(TNAMES.OBJECTS)
      .where(whereFilter(req.query))
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
      owner: auth.getUid(req),
      layerid: req.params.layerid,
      properties: req.body.properties
    }
    _setGeom(data, req.body)
    return knex(TNAMES.OBJECTS).returning('id').insert(data)
  }

  async function saveFeatureCollection (req) {
    const trxProvider = knex.transactionProvider()
    const trx = await trxProvider()
    try {
      const data = req.body.features.map(i => ({
        point: knex.st.setSRID(knex.st.geomFromGeoJSON(i.geometry), SRID),
        owner: auth.getUid(req),
        layerid: req.params.layerid,
        properties: i.properties
      }))
      const ids = await trx(TNAMES.OBJECTS).insert(data)
      await trx.commit()
      return ids
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  app.post('/:layerid([0-9]+)/', auth.authRequired, checkWriteMW, bodyParser, async (req, res, next) => {
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

  app.put('/:layerid([0-9]+)/:id([0-9]+)', auth.authRequired, checkWriteMW, bodyParser, (req, res, next) => {
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

  app.delete('/:layerid([0-9]+)/:id([0-9]+)', auth.authRequired, checkWriteMW, (req, res, next) => {
    const query = { id: req.params.id, layerid: req.params.layerid }
    knex(TNAMES.OBJECTS).where(query).del()
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })
}
