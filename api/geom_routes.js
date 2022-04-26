import { canWrite, list, create, modify, remove } from './geom'

export default (ctx) => {
  const { auth, bodyParser, knex } = ctx
  const objectsApp = ctx.express()

  async function checkWriteMW (req, res, next) {
    try {
      const can = await canWrite(req.params.layerid, auth.getUID(req), knex, req.tenantid)
      can ? next() : next(401)
    } catch (err) { next(err) }
  }

  objectsApp.get('/', async (req, res, next) => {
    try {
      res.json(await list(req.query, knex, req.tenantid))
    } catch (err) { next(err) }
  })

  objectsApp.post('/:layerid([0-9]+)', auth.session,
    checkWriteMW, bodyParser, async (req, res, next) => {
      try {
        res.json(await create(req.params.layerid, req.body, auth.getUID(req), knex, req.tenantid))
      } catch (err) { next(err) }
    })

  objectsApp.put('/:layerid([0-9]+)/:id([0-9]+)',
    auth.session, checkWriteMW, bodyParser, async (req, res, next) => {
      try {
        const { id, layerid } = req.params
        res.json(await modify(layerid, id, req.body, knex, req.tenantid))
      } catch (err) { next(err) }
    })

  objectsApp.delete('/:layerid([0-9]+)/:id([0-9]+)',
    auth.session, checkWriteMW, async (req, res, next) => {
      try {
        res.json(await remove(req.params.layerid, req.params.id, knex, req.tenantid))
      } catch (err) { next(err) }
    })

  return objectsApp
}
