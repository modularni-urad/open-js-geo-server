const knex = require('knex')
const knexPostgis = require('knex-postgis')
const path = require('path')
const { attachPaginate } = require('knex-paginate')
const DB_URL = process.env.DATABASE_URL

const opts = {
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
}
if (DB_URL.indexOf('postgres') >= 0) {
  Object.assign(opts, { client: 'pg', connection: DB_URL })
} else {
  Object.assign(opts, {
    client: 'sqlite3',
    connection: {
      filename: DB_URL === undefined ? ':memory:' : DB_URL
    },
    useNullAsDefault: true,
    debug: true,
    pool: { min: 0, max: 7 }
  })
}

const db = knex(opts)
db.st = knexPostgis(db) // postGIS
attachPaginate()

module.exports = () => {
  return db.migrate.latest()
    .then(() => {
      return process.env.RUN_SEEDS ? db.seed.run(opts) : null
    })
    .then(() => {
      return db
    })
}
