const serve = require('webpack-serve');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const config = require('../config/webpack.config.dev.js');

serve({
  config,
  open: true,
  hot: true,
  add: (app, middleware, options) => {
    // app.use(convert(proxy('/api', { target: 'http://localhost:8081' })));
    app.use(convert(history()));
  }
});
