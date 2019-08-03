import jwt from 'jsonwebtoken'

function getToken (req) {
  const auth = req.headers.authorization
  return auth && auth.match(/Bearer .+$/)
    ? auth.split(' ')[1]
    : req.query.token
}

function verify (token, req, next) {
  jwt.verify(token, process.env.SERVER_SECRET, (err, decoded) => {
    if (err) return next(err)
    req.user = decoded
    req.user.id = 123
    next()
  })
}

export default {
  MWare: (req, res, next) => {
    const token = getToken(req)
    verify(token, req, next)
  },
  optionalMWare: (req, res, next) => {
    const token = getToken(req)
    token ? verify(token, req, next) : next()
  },
  getUid: (req) => {
    return req.user.id
  }
}
