const path = require('path');

const webpack = require('webpack');
const express = require('express');
const middleware = require('webpack-dev-middleware');
const hotMiddleWare = require('webpack-hot-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');

const config = require('../config/webpack.conf');

const compiler = webpack(config);
const app = express();

const proxy = {
  '/api': {
    target: 'http://localhost:3000',
    secure: false,
    pathRewrite: { '^/api': '' },
  },
};

// webpack
app.use(
  middleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    serverSideRender: true,
  })
);

// hot
app.use(hotMiddleWare(compiler));

// proxy
Object.keys(proxy).forEach(key => {
  app.use(key, createProxyMiddleware(proxy[key]));
});

app.use('/static', express.static(path.resolve(__dirname, '../static')));

app.listen(3000, () => console.log('App listening on port 3000!'));
