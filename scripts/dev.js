const path = require('path');

const webpack = require('webpack');
const express = require('express');
const middleware = require('webpack-dev-middleware');
const hotMiddleWare = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');
const openBrowser = require('./openBrowser');

const config = require('../config/webpack.conf');
const env = require('../config/env');
const paths = require('../config/paths');

const compiler = webpack(config);
const app = express();

const proxy = {
  '/api': {
    target: 'http://localhost:3000',
    secure: false,
    pathRewrite: { '^/api': '' },
  },
};

// hot
app.use(
  hotMiddleWare(compiler, {
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  })
);

// proxy
Object.keys(proxy).forEach((key) => {
  app.use(key, createProxyMiddleware(proxy[key]));
});

app.use(
  historyApiFallback({
    publicPath: config.output.publicPath,
  })
);

// webpack
app.use(
  middleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.use('/', express.static(paths.staticPath));

app.listen(env.PORT, () => {
  openBrowser(`http://localhost:${env.PORT}`);
});
