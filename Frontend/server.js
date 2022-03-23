'use strict'

const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { createBundleRenderer } = require('vue-server-renderer');

const dev_mode = process.env.NODE_ENV !== 'production';
const dist_dir = dev_mode ? 'dist_dev' : 'dist';

const app = express();
const template = fs.readFileSync('./' + dist_dir + '/index.html', 'utf-8');
const serverBundle = require('./' + dist_dir + '/vue-ssr-server-bundle.json');
const clientManifest = require('./' + dist_dir + '/vue-ssr-client-manifest.json');

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // recommended
  template,
  clientManifest, // (optional) client build manifest
  shouldPrefetch: (file, type) => {
    // type is inferred based on the file extension.
    // https://fetch.spec.whatwg.org/#concept-request-destination
    if (type === 'script' || type === 'style') {
      return false
    }
  }
});

app.use(cookieParser());
app.disable('x-powered-by');

if (dev_mode) {
  console.log('[DEV] Serving ' + dist_dir + '/img folder')
  app.use('/img', express.static(dist_dir + '/img'));
}

app.get('*', (req, res) => {
  const context = { 
    url: req.url,
    jwt: req.cookies['jwt']
  }

  if (dev_mode) {
    if (/\.html$/.test(req.url)) {
      res.set('Content-Type', 'text/html');
    }
    if (/\.(js|css|png|jpg|gif|ico|txt)$/.test(req.url)) {
      if (fs.existsSync(dist_dir + '/' + req.url)) {
        res.sendFile(req.url, {root: dist_dir});
      }
      else if (req.url.startsWith('/img/unit_small/')) {
        res.sendFile('/img/unit_small/blank.jpg', {root: dist_dir});
      }
      else if (req.url.startsWith('/img/weapon/')) {
        res.sendFile('/img/weapon/blank.jpg', {root: dist_dir});
      }
      else if (req.url.startsWith('/previews/')) {
        res.sendFile(req.url, {root: dist_dir + '../../../..'});
      }
      else {
        console.log(req.url)
        res.sendStatus(404);
      }
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