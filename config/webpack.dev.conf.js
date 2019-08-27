const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.conf');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const devServer = require('./devServer');

module.exports = merge(baseConfig, {
  // mode关系到代码压缩质量  https://webpack.docschina.org/guides/tree-shaking/
  mode: 'development',
  // source-map,将编译后的代码映射到原代码，便于报错后定位错误
  devtool: 'inline-source-map',
  devServer,
  module: {
    rules: [],
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    // 热更新相关
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
