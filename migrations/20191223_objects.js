import { TABLE_NAMES, tableName } from '../consts'

exports.up = async (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  await builder.createTable(TABLE_NAMES.OBJECTS, (table) => {
    table.increments('id').primary()
    table.integer('layerid').references('id')
      .inTable(tableName(TABLE_NAMES.LAYERS)).notNullable()
    
    table.string('owner', 64).notNullable()
    table.json('properties').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema
  return builder.dropTable(TABLE_NAMES.OBJECTS)
}
