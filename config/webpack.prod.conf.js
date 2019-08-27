const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.base.conf');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [],
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, '../'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css',
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist'),
      },
    ]),
  ],
});
