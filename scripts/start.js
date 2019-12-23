const webpack = require('webpack');
const Server = require('webpack-dev-server');
const config = require('../config/webpack.dev.conf');
const serverConfig = require('../config/devServer');

const compiler = webpack(config);

const app = new Server(compiler, serverConfig);
app.listen(serverConfig.port, '0.0.0.0', err => {
  if (err) {
    return;
  }
});
