import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as mongoose from 'mongoose'
import * as passport from 'passport'
import cors = require('cors')
const { ensureAuthenticated } = require('connect-ensure-authenticated')
import { ExperienceRouter } from './Routes/ExperienceRouter'
import { ExperiencesRouter } from './Routes/ExperiencesRouter'
import { AuthenticationRouter } from './Routes/AuthenticationRouter'
import { PointOfInterestRouter } from './Routes/PointOfInterestRouter'
import { User } from './model/schema/User'
import { UserRepo } from './model/repo/UserRepo'
import { RouteRouter } from './Routes/RouteRouter'
import * as fileUpload from 'express-fileupload'
import { MediaRouter } from './Routes/MediaRouter'
import { PlaceTypeRouter } from './Routes/PlaceTypeRouter'
import { environment } from './config/env'

import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'

mongoose.connect(
  // tslint:disable-next-line:max-line-length
  environment.db.mongoUri,
  { useNewUrlParser: true, dbName: 'test' }).then(() => {
    console.log('Connection to the Atlas Cluster is successful!')
  })
  .catch((err) => {
    console.error(err)
    console.error('Make sure your IP has been whitelisted!')
  })
// tslint:disable-next-line:variable-name
const FacebookStrategy = require('passport-facebook').Strategy
// tslint:disable-next-line:variable-name
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new FacebookStrategy(
  {
    clientID: environment.auth.facebook.clientID,
    clientSecret: environment.auth.facebook.clientSecret,
    callbackURL: '/api/auth/facebook/callback',
  },
  (accessToken: any, refreshToken: any, profile: any, done: any) => {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    User.findOne(
      { facebookId: profile.id },
      (err: any, user: any) => {
        if (err) {
          console.log('findOne error', err)
          done(err, undefined)
        }
        const userRepo = new UserRepo()
        if (!user) {
          const newUser = userRepo.createUserFromProfile(profile, accessToken, refreshToken)
          console.log('New user, going to create entry in mongo...', profile)
          new User(newUser).save(undefined, (err: any, _user: any) => {
            if (err) {
              console.log('newUser', err)
              done(err, undefined)
            }
            done(undefined, newUser)
          })
        } else {
          done(undefined, user)
        }
      })
  }))

passport.use(new GoogleStrategy(
  {
    clientID: environment.auth.google.clientID,
    clientSecret: environment.auth.google.clientSecret,
    callbackURL: '/api/auth/google/callback',
  },

  (accessToken: any, refreshToken: any, profile: any, done: any) => {
    // const repo = new UserRepo()
    User.findOne(
      { googleId: profile.id },
      (_err: any, user: any) => {
        console.log('Google User.findOne', profile)
        const userRepo = new UserRepo()
        if (!user) {
          const newUser = userRepo.createUserFromProfile(profile, accessToken, refreshToken)
          console.log('New user, going to create entry in mongo...', newUser)
          new User(newUser).save(undefined, (_err: any, user: any) => {
            done(undefined, user)
          })
        } else {
          console.log('Existing user will return', user)
          done(undefined, user)
        }
      })
  },
))

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((obj, cb) => {
  cb(null, obj)
})

const app: express.Application = express()
// Configuration
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
const date = new Date()
app.use(require('express-session')({
  cookie: { expires: new Date(date.setMonth(date.getMonth() + 1)) },
  secret: environment.auth.passport.sessionSecret,
  resave: true,
  saveUninitialized: true,
}))

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())
// app.use(ensureAuthenticated().unless({
//   path: [
//     '/api/auth/facebook', '/api/auth/google',
//     '/api/auth/google/callback', '/api/auth/facebook/callback',
//     '/api/experience/:experienceId/snapshot',
//   ],
// }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors({
  origin: [environment.baseUrl],
}))

// app.get('/', (_req, res) => {
//   res.json({ name: 'Server is running' })
// })
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  safeFileNames: true,
  preserveExtension: true,
}))

app.use('/api/auth/', new AuthenticationRouter().getRouter())
app.use('/api/experience', new ExperienceRouter().getRouter())
app.use('/api/experiences', ensureAuthenticated(), new ExperiencesRouter().getRouter())
app.use('/api/point-of-interest', ensureAuthenticated(), new PointOfInterestRouter().getRouter())
app.use('/api/route', ensureAuthenticated(), new RouteRouter().getRouter())
app.use('/api/media', ensureAuthenticated(), new MediaRouter().getRouter())
app.use('/api/storage/media', express.static('media'))

app.use('/api/place-types', ensureAuthenticated(), new PlaceTypeRouter().getRouter())

const sslConfig: any = (environment as any).ssl
if (sslConfig) {
  app.use('/', express.static('public/dist/safarnama'))

  app.use('*', (req, res) => {
    res.redirect(200, `https://${req.headers.host}/index.html`)
  })

  const options = {
    key: fs.readFileSync(sslConfig.key),
    cert: fs.readFileSync(sslConfig.cert),
  }
  https.createServer(options, app).listen(8080)
  console.log('SSL listening on port %d', 8080, app.settings.env)
  // Redirect from http port 80 to https
  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(301, { Location: `https://${req.headers['host']}${req.url}` })
    res.end()
  }).listen(3000)
  module.exports = server
} else {
  module.exports = app.listen(3000, () => {
    console.log('Server listening on port %d in %s mode', 3000, app.settings.env)
  })
}
