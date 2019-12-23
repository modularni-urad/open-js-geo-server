import { TNAMES, SRID } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.OBJECTS, (table) => {
    table.increments('id').primary()
    table.integer('layerid').notNullable()
    table.integer('typ').notNullable()
    table.integer('owner').notNullable()
    table.string('title').notNullable()
    table.string('image')
    table.string('note')
    table.string('secret')
    table.string('link')
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
