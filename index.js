import path from 'path'
import layerRoutes from './api/layer_routes'
const knexPostgis = require('knex-postgis')

export async function migrateDB (knex, schemas = null) {
  knex.st = knexPostgis(knex) // postGIS
  const opts = {
    directory: path.join(__dirname, 'migrations')
  }
  async function migrate2schema(schemaName) {
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
    const o = Object.assign({}, opts, { schemaName })
    process.env.CUSTOM_MIGRATION_SCHEMA = schemaName
    await knex.migrate.latest(o)
  }
  return schemas
    ? schemas.reduce((p, schema) => {
        return p.then(() => migrate2schema(schema))
      }, Promise.resolve())
    : knex.migrate.latest(opts)
}

export const init = layerRoutes
