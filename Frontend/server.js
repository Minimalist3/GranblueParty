'use strict'

const express = require('express');
const cookieParser = require('cookie-parser');
const { createBundleRenderer } = require('vue-server-renderer');

const app = express();
const template = require('fs').readFileSync('./dist/index.html', 'utf-8');
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // recommended
  template,
  clientManifest // (optional) client build manifest
});

const dev_mode = process.env.NODE_ENV !== 'production';

app.use(cookieParser());
app.disable('x-powered-by');

if (dev_mode) {
  console.log('[DEV] Serving /static folder')
  app.use('/', express.static('./dist/static'));
}

app.get('*', (req, res) => {
  const context = { 
    url: req.url,
    jwt: req.cookies['jwt']
  }

  if (dev_mode) {
    if (/\.(png|jpg|gif|ico|txt)$/.test(req.url)) {
      res.sendStatus(404);
      return;
    }
    if (/\.html$/.test(req.url)) {
      res.set('Content-Type', 'text/html');
    }
    if (/\.(js|css)$/.test(req.url)) {
      res.sendFile(req.url, {root: './dist'});
      return;
    }

    console.log(context);
  }
  else {
    res.set('Content-Type', 'text/html');
  }
 
  renderer.renderToString(context, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error');
      console.log(err);
    }
    else {
      res.end(html);
    }
  });
});

app.listen(4000);