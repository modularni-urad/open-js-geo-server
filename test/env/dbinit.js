import _ from 'underscore'
import { newDb, DataType } from 'pg-mem'

function isGeometry (val) {
  try {
    require('wkx').Geometry.parse(Buffer.from(val, 'hex'))
    return true
  } catch (_) {
    return false
  }  
}

export default async function initDB () {
  const db = newDb();

  // create a Knex instance bound to this db
  //  =>  This replaces require('knex')({ ... })
  const knex = db.adapters.createKnex()

  db.public.registerEquivalentType({
    name: "geometry",
    equivalentTo: DataType.text,
    isValid: isGeometry
  })

  return knex
}
