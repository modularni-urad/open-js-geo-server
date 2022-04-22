import _ from 'underscore'

module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  const p = {
    title: 'paroProject1',
    writers: '*',
    settings: {},
  }

  return describe('layers', () => {
    //
    it('must not create a new item without auth', async () => {
      const res = await r.post(`/`).send(p)
      res.should.have.status(401)
    })

    // it('must not create a new item without mandatory item', async () => {
    //   const res = await r.post(`/${g.parocall.id}`).send(_.omit(p, 'name'))
    //     .set('Authorization', 'Bearer f')
    //   res.should.have.status(400)
    // })

    it('shall create a new layer', async () => {
      const res = await r.post(`/`).send(p).set('Authorization', 'Bearer f')
      res.should.have.status(201)
      res.should.have.header('content-type', /^application\/json/)
    })

    it('shall get layers', async () => {
      const res = await r.get(`/`)
      res.should.have.status(200)
      res.body.data.length.should.eql(1)
      res.body.data[0].title.should.eql(p.title)
      g.gislayer = res.body.data[0]
    })

    it('shall update the item pok1', async () => {
      const change = {
        title: 'pok1changed'
      }
      const res = await r.put(`/${g.gislayer.id}`)
        .send(change).set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get layers', async () => {
      const res = await r.get(`/`)
      res.should.have.status(200)
      res.body.data.length.should.eql(1)
      res.body.data[0].title.should.eql('pok1changed')
    })
  })
}
