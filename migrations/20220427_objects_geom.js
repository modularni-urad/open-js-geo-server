import { TABLE_NAMES, SRID } from '../consts'

exports.up = async (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  const table = process.env.CUSTOM_MIGRATION_SCHEMA
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${TABLE_NAMES.OBJECTS}`
    : TABLE_NAMES.OBJECTS
  return builder.raw(`
    ALTER TABLE ${table}
    ADD COLUMN polygon geometry(Polygon, ${SRID})
    ADD COLUMN point geometry(Point, ${SRID})
  `)
}

exports.down = (knex, Promise) => {
  // const builder = process.env.CUSTOM_MIGRATION_SCHEMA
  //   ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
  //   : knex.schema
  // return builder.dropTable(TABLE_NAMES.OBJECTS)
}
