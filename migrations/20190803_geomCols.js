import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.raw(`
    ALTER TABLE ${TNAMES.POLYGONS}
    ADD COLUMN geom geometry(Polygon, 4326)
    NOT NULL
  `)
}

exports.down = (knex, Promise) => {
  return knex.schema.table(TNAMES.POLYGONS, table => {
    table.dropColumn('geom')
  })
}
