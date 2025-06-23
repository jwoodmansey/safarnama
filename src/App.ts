import cors = require('cors');
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as passport from 'passport';

import { environment } from './config/env';
import { configureAuthentication } from './express/configureAuthentication';
import { configureDatabase } from './express/configureDatabase';
import { errorHandler } from './middleware/errorHandler'; // Import your error handler
import router from './routes'; // Import your routes from routes.ts

configureDatabase();
configureAuthentication();

const app = express();
const path = require('path');
// Configuration
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());

const date = new Date();
app.use(
  require('express-session')({
    cookie: { expires: new Date(date.setMonth(date.getMonth() + 12)) },
    secret: environment.auth.passport.sessionSecret,
    saveUninitialized: false,
    resave: false,
  }) as express.RequestHandler,
);

app.use(passport.initialize() as any);
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [environment.baseUrl],
    credentials: true,
  }),
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    safeFileNames: true,
    preserveExtension: true,
  }) as express.RequestHandler,
);

// Serve static files
app.use(express.static('public/dist/safarnama') as any);
app.use('/api/storage/media', express.static(path.join(__dirname, '../media')));
app.use('/api/storage/icon', express.static(path.join(__dirname, '../icon')));
// Use the router defined in routes.ts
app.use(router); // This will register all the routes

// Handle frontend
app.use('/*', (_req, res) => {
  res.sendFile('index.html', { root: 'public/dist/safarnama' });
});

// Error handling middleware
app.use(errorHandler); // Add the error handler after all routes

// SSL Configuration Check
const sslConfig: any = (environment as any).ssl;

if (sslConfig && sslConfig.key && sslConfig.cert) {
  // SSL setup
  const options = {
    key: fs.readFileSync(sslConfig.key),
    cert: fs.readFileSync(sslConfig.cert),
  };

  https.createServer(options, app).listen(8080, () => {
    console.log('SSL server listening on port %d', 8080);
  });

  // Redirect HTTP to HTTPS
  http
    .createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    })
    .listen(3000, () => {
      console.log(
        'HTTP server listening on port %d, redirecting to HTTPS',
        3000,
      );
    });
} else {
  // HTTP only setup
  app.listen(3000, () => {
    console.log(
      'Server listening on port %d in %s mode',
      3000,
      app.settings.env,
    );
  });
}
