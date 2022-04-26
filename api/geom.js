import _ from 'underscore'
import { whereFilter } from 'knex-filter-loopback'
import { TABLE_NAMES, SRID, getQB } from '../consts'

export function list (query, knex, schema = null) {
  return getQB(knex, TABLE_NAMES.OBJECTS, schema)
    .where(whereFilter(query))
    .select('id', 'properties', knex.st.asText('polygon'), knex.st.asText('point'))
}

export function create (layerid, data, uid, knex, schema = null) {
  switch (data.type) {
    case 'Feature':
      return saveFeature(layerid, data, uid, knex)
    case 'FeatureCollection':
      return saveFeatureCollection(layerid, data, uid, knex)
    default:
      throw new Error('wrong GeoJSON')
  }
}

export function modify (layerid, id, data, knex, schema = null) {
  const change = {}
  data.geometry && _setGeom(change, data, knex)
  data.properties && Object.assign(change, { properties: data.properties })
  return getQB(knex, TABLE_NAMES.OBJECTS, schema).where({ id, layerid }).update(change)
}

export function remove (layerid, id, knex, schema = null) {
  return getQB(knex, TABLE_NAMES.OBJECTS, schema).where({ id, layerid }).del()
}

export function canWrite (layerid, UID, knex, schema = null) {
  return getQB(knex, TABLE_NAMES.LAYERS, schema).where({ id: layerid || null }).first()
    .then(layer => {
      if (!layer) throw new Error(404)
      function _amongWriters () {
        return layer.writers === '*' || _.find(layer.writers.split(','), UID)
      }
      // we are not owner nor among writers
      if (layer.owner === UID || _amongWriters()) {
        return true
      }
      throw new Error(401)
    })
}

async function saveFeature (layerid, body, uid, knex, schema = null) {
  const data = { owner: uid, layerid, properties: body.properties }
  _setGeom(data, body, knex)
  return getQB(knex, TABLE_NAMES.OBJECTS, schema).returning('id').insert(data)
}

async function saveFeatureCollection (layerid, body, uid, knex) {
  const trxProvider = knex.transactionProvider()
  const trx = await trxProvider()
  try {
    const data = body.features.map(i => ({
      point: knex.st.setSRID(knex.st.geomFromGeoJSON(i.geometry), SRID),
      owner: uid,
      layerid,
      properties: i.properties
    }))
    const ids = await trx(TABLE_NAMES.OBJECTS).insert(data)
    await trx.commit()
    return ids
  } catch (err) {
    await trx.rollback()
    throw err
  }
}

function _setGeom (data, body, knex) {
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
