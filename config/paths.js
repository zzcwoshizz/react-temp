const path = require('path');

module.exports = {
  publicPath: '/',
  buildPath: path.resolve(__dirname, '../dist'),
  staticPath: path.resolve(__dirname, '../public'),
  srcPath: path.resolve(__dirname, '../src'),
  htmlPath: path.resolve(__dirname, '../src/index.html'),
  tsPath: path.resolve(__dirname, '..', 'tsconfig.json'),
};
