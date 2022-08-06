const knex = require('knex')
const path = require('path')
const { attachPaginate } = require('knex-paginate')

const opts = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    disableMigrationsListValidation: true
  },
  debug: process.env.NODE_ENV !== 'production'
}

export default async () => {
  const db = knex(opts)
  attachPaginate()

  await db.migrate.latest()

  return db
}
