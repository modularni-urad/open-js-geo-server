import { TNAMES, SRID } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.OBJECTS, (table) => {
    table.increments('id').primary()
    table.integer('layerid').notNullable()
    table.integer('owner').notNullable()
    table.json('properties').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  }).then(() => {
    return knex.schema.raw(`
      ALTER TABLE ${TNAMES.OBJECTS}
      ADD COLUMN polygon geometry(Polygon, ${SRID})
    `)
  }).then(() => {
    return knex.schema.raw(`
      ALTER TABLE ${TNAMES.OBJECTS}
      ADD COLUMN point geometry(Point, ${SRID})
    `)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.OBJECTS)
}
