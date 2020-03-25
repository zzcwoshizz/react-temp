const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const webpack = require('webpack');
const clientConfig = require('../config/webpack.conf');
const serverConfig = require('../config/webpack.server.conf');
const paths = require('../config/paths');

const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);

function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

const start = (name, compiler) => {
  console.log(`Start ${name} production build...`);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(chalk.red(err.stack || err));
        if (err.details) {
          console.log(chalk.red(err.details));
        }
        reject();
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.log(chalk.red(info.errors));
        reject();
        return;
      }

      resolve(info);
      console.log(chalk.green(`Compiled ${name} successfully.`));
    });
  });
};

(async () => {
  delDir(paths.buildPath);
  Promise.all([
    start('client', clientCompiler).then(stats => {
      fs.writeFileSync(
        path.resolve(paths.buildPath, 'client-stats.json'),
        JSON.stringify(stats)
      );
    }),
    start('server', serverCompiler).then(stats => {
      fs.writeFileSync(
        path.resolve(paths.buildPath, 'server-stats.json'),
        JSON.stringify(stats)
      );
    }),
  ]);
})();
