import { TNAMES } from '../consts'
import _ from 'underscore'

export function detail (layerid, knex) {
  return knex(TNAMES.LAYERS).where({ id: layerid }).first()
    .then(info => {
      if (!info) throw new Error(404)
      return info
    })
}

export function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || 1
  return knex(TNAMES.LAYERS).paginate({ perPage, currentPage })
}

export function create (data, uid, knex) {
  Object.assign(data, { owner: uid })
  return knex(TNAMES.LAYERS).returning('id').insert(data)
}

export async function modify (layerid, data, knex) {
  const change = _.omit(data, ['id', 'created', 'owner'])
  return knex(TNAMES.LAYERS).where({ id: layerid }).update(change)
}
