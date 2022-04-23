import { TABLE_NAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TABLE_NAMES.LAYERS, (table) => {
    table.increments('id').primary()
    table.string('title')
    table.string('writers')
    table.string('owner', 64).notNullable()
    table.json('settings').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TABLE_NAMES.LAYERS)
}
// INSERT into layers (title, writers, owner, geomtype) VALUES ('pokus', '', 11, 'POLYGON')
