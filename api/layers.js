import { TABLE_NAMES, getQB } from '../consts'
import { APIError } from 'modularni-urad-utils'
import _ from 'underscore'

export function detail (layerid, knex, schema = null) {
  return getQB(TABLE_NAMES.LAYERS, knex, schema).where({ id: layerid }).first()
    .then(info => {
      if (!info) throw new APIError(404, 'layer not found')
      return info
    })
}

export function list (query, knex, schema = null) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || 1
  return getQB(TABLE_NAMES.LAYERS, knex, schema).paginate({ perPage, currentPage })
}

export function create (data, uid, knex, schema = null) {
  Object.assign(data, { owner: uid })
  return getQB(TABLE_NAMES.LAYERS, knex, schema).returning('id').insert(data)
}

export async function modify (layerid, data, knex, schema = null) {
  const change = _.omit(data, ['id', 'created', 'owner'])
  return getQB(TABLE_NAMES.LAYERS, knex, schema).where({ id: layerid }).update(change)
}
