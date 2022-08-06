import _ from 'underscore'
import { whereFilter } from 'knex-filter-loopback'
import { APIError } from 'modularni-urad-utils'
import { TABLE_NAMES, getQB } from '../consts'

export function list (query, knex, schema = null) {
  return getQB(knex, TABLE_NAMES.OBJECTS, schema).where(whereFilter(query))
}

export function create (layerid, body, uid, knex, schema = null) {
  const data = { 
    owner: uid, 
    layerid, 
    geom: body.geom, 
    properties: _.omit(body, 'geom')
  }
  return getQB(knex, TABLE_NAMES.OBJECTS, schema).returning('id').insert(data)
}

export function modify (layerid, id, body, knex, schema = null) {
  const change = {}
  const properties = _.omit(body, 'geom')
  body.geom && Object.assign(change, { geom: body.geom })
  !_.isEmpty(properties) && Object.assign(change, { properties })
  return getQB(knex, TABLE_NAMES.OBJECTS, schema)
    .where({ id, layerid }).update(change)
}

export function remove (layerid, id, knex, schema = null) {
  return getQB(knex, TABLE_NAMES.OBJECTS, schema).where({ id, layerid }).del()
}

export function canWrite (layerid, UID, knex, schema = null) {
  return getQB(knex, TABLE_NAMES.LAYERS, schema).where({ id: layerid || null }).first()
    .then(layer => {
      if (!layer) throw new APIError(404)
      function _amongWriters () {
        return layer.writers === '*' || _.find(layer.writers.split(','), UID)
      }
      // we are not owner nor among writers
      if (layer.owner === UID || _amongWriters()) {
        return true
      }
      throw new APIError(401)
    })
}
