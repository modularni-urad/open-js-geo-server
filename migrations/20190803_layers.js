const TNAME = 'layers'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAME, (table) => {
    table.increments('id').primary()
    table.string('title')
    table.string('writers')
    table.integer('owner')
    table.enu('geomtype', ['POLYGON', 'POINT', 'LINE']).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAME)
}
