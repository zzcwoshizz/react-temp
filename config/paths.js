const path = require('path');

module.exports = {
  publicPath: '/',
  buildPath: path.resolve(__dirname, '../dist'),
  srcPath: path.resolve(__dirname, '../src'),
  htmlPath: path.resolve(__dirname, '../src/index.html'),
  tsLintPath: path.resolve(__dirname, '..', 'tslint.json'),
  tsPath: path.resolve(__dirname, '..', 'tsconfig.json'),
  entry: 'main',
};
