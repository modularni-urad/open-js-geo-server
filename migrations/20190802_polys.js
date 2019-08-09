import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema
    .createTable(TNAMES.POLYGONS, (table) => {
      table.increments('id').primary()
      table.integer('layerid')
      table.integer('owner')
      table.string('title')
      table.string('link')
      table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.POLYGONS)
}
