import { detail, list, create, modify } from './layers'

export default (ctx) => {
  const { auth, JSONBodyParser, knex } = ctx
  const layerApp = ctx.express()

  layerApp.get('/:id([0-9]+)', async (req, res, next) => {
    try {
      res.json(await detail(req.params.id, knex))
    } catch (err) { next(err) }
  })

  layerApp.get('/', async (req, res, next) => {
    try {
      res.json(await list(req.query, knex))
    } catch (err) { next(err) }
  })

  layerApp.post('/', auth.required, JSONBodyParser, async (req, res, next) => {
    try {
      res.status(201).json(await create(req.body, auth.getUid(req), knex))
    } catch (err) { next(err) }
  })

  layerApp.put('/:id([0-9]+)',
    auth.required, JSONBodyParser, async (req, res, next) => {
      try {
        res.json(await modify(req.params.id, req.body, knex))
      } catch (err) { next(err) }
    })
  return layerApp
}
