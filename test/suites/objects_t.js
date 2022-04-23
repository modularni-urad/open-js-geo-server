import _ from 'underscore'

module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  const p = {
    "type": "Feature",
    "properties": {
      "color": "red"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        14.765625,
        51.17934297928927
      ]
    }
  }

  return describe('objects', () => {
    //
    it('shall create a new object', async () => {
      const res = await r.post(`/geom/${g.gislayer.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      res.should.have.header('content-type', /^application\/json/)
      g.objectid = res.body[0]
    })

    it('shall update a new object', async () => {
      const change = {
        properties: {
          color: 'blue'
        }
      }
      const res = await r.put(`/geom/${g.gislayer.id}/${g.objectid}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall list layer objects', async () => {
      const res = await r.get(`/geom/?layerid=${g.gislayer.id}`)
      res.should.have.status(200)
      res.body.length.should.eql(1)
      res.body[0].properties.color.should.eql('blue')
    })

    it('shall delete object', async () => {
      const res = await r.del(`/geom/${g.gislayer.id}/${g.objectid}`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall list now empty layer objects', async () => {
      const res = await r.get(`/geom/?layerid=${g.gislayer.id}`)
      res.should.have.status(200)
      res.body.length.should.eql(0)
    })

  })
}
