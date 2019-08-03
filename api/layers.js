const TNAME = 'layers'
import _ from 'underscore'

export default (app, knex, auth, bodyParser) => {
  //
  app.get('/:id([0-9]+)', (req, res, next) => {
    knex(TNAME).where({id: req.params.id}).first()
    .then(info => {
      res.json(info)
      next()
    })
    .catch(next)
  })

  app.get('/', (req, res, next) => {
    knex(TNAME).then(info => {
      res.json(info)
      next()
    })
    .catch(next)
  })

  app.post(`/`, auth.MWare, bodyParser, (req, res, next) => {
    Object.assign(req.body, {owner: auth.getUid(req)})
    knex(TNAME).returning('id').insert(req.body)
    .then(savedid => {
      res.status(201).json(savedid)
      next()
    })
    .catch(next)
  })

  app.put(`/:id([0-9]+)`, auth.MWare, bodyParser, (req, res, next) => {
    const change = _.omit(req.body, ['id', 'created', 'geomtype'])
    knex(TNAME).where({id: req.params.id}).update(change)
    .then(rowsupdated => {
      res.json(rowsupdated)
      next()
    })
    .catch(next)
  })
}
