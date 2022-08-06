import _ from 'underscore'
var wkx = require('wkx')

module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  const coords = [
    14.765625,
    51.17934297928927
  ]
  const p = {
    color: 'red',
    geom: wkx.Geometry.parseGeoJSON({
      "type": "Point",
      "coordinates": coords
    }).toWkb().toString('hex')
  }

  return describe('objects', () => {
    //
    it('shall create a new object', async () => {
      const res = await r.post(`/objects/${g.gislayer.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      res.should.have.header('content-type', /^application\/json/)
      g.objectid = res.body[0]
    })

    it('shall update a new object', async () => {
      const change = { color: 'blue' }
      const res = await r.put(`/objects/${g.gislayer.id}/${g.objectid}`)
        .send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall update geometry', async () => {
      const change = {
        geom: wkx.Geometry.parseGeoJSON({
          "type": "Point",
          "coordinates": [ 1, 2 ]
        }).toWkb().toString('hex')
      }
      const res = await r.put(`/objects/${g.gislayer.id}/${g.objectid}`)
        .send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall list layer objects', async () => {
      const res = await r.get(`/objects/?layerid=${g.gislayer.id}`)
      res.should.have.status(200)
      res.body.length.should.eql(1)
      res.body[0].properties.color.should.eql('blue')
      const gj = wkx.Geometry.parse(Buffer.from(res.body[0].geom, 'hex')).toGeoJSON()
      gj.coordinates[0].should.eql(1)
      gj.coordinates[1].should.eql(2)
    })

    it('shall delete object', async () => {
      const res = await r.del(`/objects/${g.gislayer.id}/${g.objectid}`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall list now empty layer objects', async () => {
      const res = await r.get(`/objects/?layerid=${g.gislayer.id}`)
      res.should.have.status(200)
      res.body.length.should.eql(0)
    })

  })
}
