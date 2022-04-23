import { TABLE_NAMES } from '../consts'
import { APIError } from 'modularni-urad-utils'
import _ from 'underscore'

export function detail (layerid, knex) {
  return knex(TABLE_NAMES.LAYERS).where({ id: layerid }).first()
    .then(info => {
      if (!info) throw new APIError(404, 'layer not found')
      return info
    })
}

export function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || 1
  return knex(TABLE_NAMES.LAYERS).paginate({ perPage, currentPage })
}

export function create (data, uid, knex) {
  Object.assign(data, { owner: uid })
  return knex(TABLE_NAMES.LAYERS).returning('id').insert(data)
}

export async function modify (layerid, data, knex) {
  const change = _.omit(data, ['id', 'created', 'owner'])
  return knex(TABLE_NAMES.LAYERS).where({ id: layerid }).update(change)
}
