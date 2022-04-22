import { TABLE_NAMES  } from "../../consts"

export default async function cleanupDB(knex) {
  async function removePublicTables () {
    const tables = await knex.raw(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'`)
    await Promise.all(tables.rows.map(s => {
      return knex.raw(`drop table "${s.table_name}" CASCADE;`).catch(err => {})
    }))
    return 'ok'
  }
  try {
    await removePublicTables()
    console.log('DB cleaned successfully --------------------')
  } catch (err) {
    console.error(err)
  }  
}