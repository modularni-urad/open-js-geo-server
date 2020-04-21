const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const nodeify = require('nodeify')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const redis = require('redis')

const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()

function nodeifyAsync (asyncFunction) {
  return function (...args) {
    return nodeify(asyncFunction(...args.slice(0, -1)), args[args.length - 1])
  }
}

export function initAuth (app) {
  app.use(cookieParser())
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production'
      }
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  passport.serializeUser((userId, done) => {
    done(null, userId)
  })
  passport.deserializeUser((userId, done) => {
    done(null, userId)
  })
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        secretOrKey: process.env.SHARED_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
      },
      nodeifyAsync(async payload => {
        return payload
      })
    )
  )
  app.post('/login', passport.authenticate('jwt'), (req, res) => {
    res.send({
      user: req.user,
      message: 'Logged in successfully.'
    })
  })
  app.post('/logout', (req, res) => {
    req.logout()
    res.send({ message: 'Logged out successfully.' })
  })
}

export function getUid (req) {
  return req.user.id
}

export function authRequired (req, res, next) {
  return req.user ? next() : next(401)
}
