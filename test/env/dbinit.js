import _ from 'underscore'
import Knex from 'knex'
process.env.DATABASE_URL='postgresql://test:test@server.dhkm.cz:5432/testdb'

export default async function initDB () {
  const opts = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    debug: true
  }
  const knex = Knex(opts)
  // await knex.schema.builder.raw(`CREATE EXTENSION postgis;`)

  return knex
}
