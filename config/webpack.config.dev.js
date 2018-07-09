'use strict';

const AutoDllPlugin = require('autodll-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const paths = require('./paths');
const publicPath = '/';

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname),

  /**
   * entry
   */
  entry: {
    index: path.resolve(paths.appSrc, 'index.tsx'),
  },
  output: {
    filename: 'static/js/[name].bundle.js',
    publicPath: publicPath,
    path: paths.appBuild,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: paths.appSrc,
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
            options: {
              configFileName: paths.appTsConfig,
              useCache: true,
              // useBabel: true,
              // babelOptions: {
              //   babelrc: false,
              //   presets: [
              //     [
              //       '@babel/preset-env',
              //       { targets: 'last 2 versions, ie 11', modules: false }
              //     ]
              //   ]
              // },
              // babelCore: '@babel/core'
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(paths.appSrc, 'scss')],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.mjs',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(paths.appPublic, 'index.html'),
      filename: 'index.html',
    }),
    new AutoDllPlugin({
      debug: true,
      inject: true,
      filename: '[name].[hash].js',
      entry: {
        vendor: ['react', 'react-dom'],
      },
    }),
    new CheckerPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      watch: paths.appSrc,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint,
    }),
  ],
};
