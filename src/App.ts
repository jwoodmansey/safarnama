import * as express from 'express'
import * as fileUpload from 'express-fileupload'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import * as passport from 'passport'
import { environment } from './config/env'
import { configureAuthentication } from './express/configureAuthentication'
import { configureDatabase } from './express/configureDatabase'
import { AdminRouter } from './Routes/AdminRouter'
import { AuthenticationRouter } from './Routes/AuthenticationRouter'
import { ExperienceRouter } from './Routes/ExperienceRouter'
import { ExperiencesRouter } from './Routes/ExperiencesRouter'
import { MediaRouter } from './Routes/MediaRouter'
import { PlaceTypeRouter } from './Routes/PlaceTypeRouter'
import { PointOfInterestRouter } from './Routes/PointOfInterestRouter'
import { ProjectRouter } from './Routes/ProjectRouter'
import { RouteRouter } from './Routes/RouteRouter'
import { UserRouter } from './Routes/UserRouter'
import cors = require('cors')
const { ensureAuthenticated } = require('connect-ensure-authenticated')

configureDatabase()
configureAuthentication()

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
  saveUninitialized: false,
  resave: false,
}))

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize() as any)
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors({
  origin: [environment.baseUrl],
}))

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  safeFileNames: true,
  preserveExtension: true,
}) as any)

app.use('/api/storage/media', express.static('media') as any)
app.use('/api/storage/icon', express.static('icon') as any)

app.use('/api/auth/', new AuthenticationRouter().getRouter())
app.use('/api/experience', new ExperienceRouter().getRouter())
app.use('/api/experiences', new ExperiencesRouter().getRouter())
app.use('/api/point-of-interest', ensureAuthenticated(), new PointOfInterestRouter().getRouter())
app.use('/api/route', ensureAuthenticated(), new RouteRouter().getRouter())
app.use('/api/user', ensureAuthenticated(), new UserRouter().getRouter())
app.use('/api/media', ensureAuthenticated(), new MediaRouter().getRouter())
app.use('/api/admin', ensureAuthenticated(), new AdminRouter().getRouter())
app.use('/api/place-types', ensureAuthenticated(), new PlaceTypeRouter().getRouter())
app.use('/api/project', ensureAuthenticated(), new ProjectRouter().getRouter())

const sslConfig: any = (environment as any).ssl
if (sslConfig) {
  app.use('/', express.static('public/dist/safarnama') as any)

  app.use('/*', (_req, res) => {
    res.sendFile('index.html', { root: 'public/dist/safarnama' })
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
