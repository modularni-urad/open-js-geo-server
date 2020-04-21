import { TNAMES } from '../consts'
import _ from 'underscore'

export default (app, knex, auth, bodyParser) => {
  //
  app.get('/:id([0-9]+)', (req, res, next) => {
    knex(TNAMES.LAYERS).where({ id: req.params.id }).first()
      .then(info => {
        if (!info) throw new Error(404)
        res.json(info)
        next()
      })
      .catch(next)
  })

  app.get('/', (req, res, next) => {
    const perPage = Number(req.query.perPage) || 10
    const currentPage = Number(req.query.currentPage) || 1
    knex(TNAMES.LAYERS).paginate({ perPage, currentPage }).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.post('/', auth.required, bodyParser, (req, res, next) => {
    Object.assign(req.body, { owner: auth.getUid(req) })
    knex(TNAMES.LAYERS).returning('id').insert(req.body)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  app.put('/:id([0-9]+)', auth.required, bodyParser, (req, res, next) => {
    const change = _.omit(req.body, ['id', 'created', 'owner'])
    knex(TNAMES.LAYERS).where({ id: req.params.id }).update(change)
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })
}
