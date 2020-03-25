const vm = require('vm');
const fs = require('fs');
const path = require('path');

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const openBrowser = require('../scripts/openBrowser');

const setupDevServer = require('./setupDevServer');
const env = require('../config/env');
const paths = require('../config/paths');
const ServerRender = require('./ServerRender');

const app = express();
const isDev = env.NODE_ENV === 'development';

if (isDev) {
  app.use(express.static('.'));
} else {
  app.use(express.static('dist'));
}

const proxy = {
  '/api': {
    target: 'http://localhost:3000',
    secure: false,
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
    logLevel: isDev ? 'debug' : 'silent',
  },
};

// proxy
Object.keys(proxy).forEach(key => {
  app.use(key, createProxyMiddleware(proxy[key]));
});

const template = fs.readFileSync(
  path.resolve(__dirname, '../src/index.html'),
  'utf-8'
);

const vendors = [];
if (isDev) {
  vendors.push(`<script src="${paths.publicPath + 'vendor.dll.js'}"></script>`);
} else {
}

const start = async () => {
  const render = new ServerRender();
  render.template = template.replace('<!--vendor-assets-->', vendors.join(''));

  const getDevServer = devServer => {
    render.clientStats = devServer.clientStats;

    const serverBundle = devServer.serverBundle;

    const sandbox = {
      console,
      module,
      require,
    };
    const vmScript = new vm.Script(serverBundle);
    vmScript.runInNewContext(sandbox);
    render.createApp = sandbox.module.exports.createApp;
    render.createStore = sandbox.module.exports.createStore;
    render.routes = sandbox.module.exports.routes;
  };

  if (isDev) {
    await setupDevServer(app, getDevServer);
  } else {
    const serverStats = require(path.resolve(
      paths.buildPath,
      'server-stats.json'
    ));

    const serverEntry = require(path.resolve(
      serverStats.outputPath,
      serverStats.entrypoints[paths.entry].assets[0]
    ));

    render.createApp = serverEntry.createApp;
    render.createStore = serverEntry.createStore;
    render.routes = serverEntry.routes;
    const clientStats = require(path.resolve(
      paths.buildPath,
      'loadable-stats.json'
    ));
    render.clientStats = clientStats;
  }

  app.get('*', (req, res) => {
    render
      .renderToString(req, res)
      .then(({ html, statusCode }) => {
        res.statusCode = statusCode;
        res.send(html);
      })
      .catch(() => {
        res.status(500).send('Internal server error');
      });
  });

  app.listen(env.PORT, () => {
    if (isDev) {
      // openBrowser(`http://localhost:${env.PORT}`);
    }
  });
};

start();
