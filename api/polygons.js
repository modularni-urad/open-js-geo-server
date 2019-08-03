const TNAME = 'polygons'
import _ from 'underscore'

export default (app, knex, auth, bodyParser) => {
  //
  function checkWriteMW (req, res, next) {
    knex(TNAME).where({id: req.params.layerId}).first()
    .then(layer => {
      function _amongWriters () {
        _.find(layer.writers.split(','), req.user.id)
      }
      // we are not owner nor among writers
      if (layer.owner !== req.user.id && !_amongWriters()) {
        throw new Error(401)
      }
      next()
    })
  }

  app.get('/:layerId([0-9]+)/', (req, res, next) => {
    knex(TNAME).where({id: req.params.ticketId}).first()
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

  app.post(`/:layerId([0-9]+)`, auth.MWare, checkWriteMW, bodyParser, (req, res, next) => {
    Object.assign(req.body, {owner: req.user.id})
    knex(TNAME).returning('id').insert(req.body)
    .then(savedid => {
      res.status(201).json(savedid)
      next()
    })
    .catch(next)
  })

  app.put(`/:ticketId([0-9]+)/:id([0-9]+)`, auth.MWare, checkWriteMW, bodyParser, (req, res, next) => {
    const change = _.omit(req.body, ['id', 'created', 'geomtype'])
    knex(TNAME).where({id: req.params.ticketId}).update(change)
    .then(rowsupdated => {
      res.json(rowsupdated)
      next()
    })
    .catch(next)
  })
}
