const path = require('path');

const webpack = require('webpack');
const MFS = require('memory-fs');
const chalk = require('chalk');

const clientConfig = require('../config/webpack.conf');
const serverConfig = require('../config/webpack.server.conf');
const paths = require('../config/paths');

module.exports = function setupDevServer(app, callback) {
  return new Promise((resolve, reject) => {
    let clientStats;
    let serverBundle;

    const done = () => {
      if (clientStats && serverBundle) {
        resolve({
          serverBundle,
          clientStats,
        });
        callback({
          serverBundle,
          clientStats,
        });
      }
    };

    // 客户端
    const clientCompiler = webpack(clientConfig);

    // middleware
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
      logLevel: 'silent',
      noInfo: true,
      publicPath: clientConfig.output.publicPath,
    });
    app.use(devMiddleware);

    // 热更新中间件
    const hotMiddleware = require('webpack-hot-middleware')(clientCompiler);
    app.use(hotMiddleware);

    clientCompiler.hooks.done.tap('done', stats => {
      const info = stats.toJson();
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      if (stats.hasErrors()) {
        console.error(info.errors);
        return;
      }

      clientStats = undefined;
      clientStats = JSON.parse(
        clientCompiler.outputFileSystem.readFileSync(
          path.join(clientConfig.output.path, 'loadable-stats.json'),
          'utf-8'
        )
      );
      done();
    });

    // 服务端
    const serverCompiler = webpack(serverConfig);

    const mfs = new MFS();
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
      const info = stats.toJson();
      if (stats.hasWarnings()) {
        console.warn(chalk.yellow(info.warnings));
      }

      if (stats.hasErrors()) {
        console.error(chalk.red(info.errors));
        return;
      }

      serverBundle = undefined;
      serverBundle = serverCompiler.outputFileSystem.readFileSync(
        path.join(
          serverConfig.output.path,
          info.entrypoints[paths.entry].assets[0]
        ),
        'utf-8'
      );
      done();
    });
  });
};
