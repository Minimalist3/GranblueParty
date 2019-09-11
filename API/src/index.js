"use strict";

import cors from 'cors';
import compression from 'compression';
import crypto from 'crypto';
import debounce from 'lodash.debounce';
import express from 'express';
import fs from 'fs';
import passport from 'passport';

import models from './models';
import routes from './routes';
import config from './config';

const app = express();

// Enable CORS
app.use(cors({
  origin: config.frontend.url + ':' + config.frontend.port,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

// Enable gzip compression
app.use(compression());
// Passport support
app.use(passport.initialize());
import './passport-providers';

// Make a hash from the DB version, to enable proper caching
// Hash is updated automatically each time the file changes
app.set('etag', false);
let dbVersion;
const dbVersionChanged = debounce(() => {
  const hash = crypto.createHash('md5');
  hash.update(fs.readFileSync(config.db.versionFile));
  dbVersion = '"' + hash.digest('hex') + '"';
}, 500);
dbVersionChanged(); // Read once on start
fs.watch(config.db.versionFile, dbVersionChanged);

app.get('*', (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("ETag", dbVersion);
  next();
});

// Keep the model in the request to keep the other functions pure
app.use((req, res, next) => {
  req.context = {
    models
  };
  next();
});

// Routes for Daily Grind
app.use('/daily', routes.daily);
// Routes For Party Builder
app.use('/party', routes.party);
// GET routes for Collection Tracker
app.use('/tracker', routes.tracker);
// User creation/login route
app.use('/user', routes.user);
// Release schedule
app.use('/release', routes.release);

if (process.env.NODE_ENV === "production") {

}
else {
  app.use('/admin', routes.admin);
}

// 404 everything else
app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(config.app.port, () =>
  console.log('Granblue Party REST API listening on port ' + config.app.port),
);