
export const TABLE_NAMES = {
  OBJECTS: 'objects',
  LAYERS: 'layers'
}

export const SRID = 4326

// export const GEOM_COLUMNS = ['polygon', 'point']

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}
export function tableName (tname) {
  return process.env.CUSTOM_MIGRATION_SCHEMA 
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${tname}`
    : tname
}