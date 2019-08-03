const TNAME = 'polygons'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAME, (table) => {
    table.increments('id').primary()
    table.integer('layerid')
    table.specificType('geom', 'POLYGON')
    table.string('title')
    table.string('link')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAME)
}
// some_table ADD COLUMN geom geometry(Point,4326);
