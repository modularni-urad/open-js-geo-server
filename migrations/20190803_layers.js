import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.LAYERS, (table) => {
    table.increments('id').primary()
    table.string('title')
    table.string('writers')
    table.integer('owner').notNullable()
    table.json('settings').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.LAYERS)
}
// INSERT into layers (title, writers, owner, geomtype) VALUES ('pokus', '', 11, 'POLYGON')
