'use strict';

const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const AutoDllPlugin = require('autodll-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const paths = require('./paths');
const publicPath = '/';

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname),

  /**
   * entry
   */
  entry: [
    path.resolve(paths.appSrc, 'index.tsx'),
    'webpack-plugin-serve/client',
  ],
  output: {
    filename: 'static/js/[name].bundle.js',
    publicPath: publicPath,
    path: paths.appBuild,
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        oneOf: [
          // js
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          // ts
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
                  plugins: () => [],
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
                  plugins: () => [],
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
          {
            exclude: [/\.(js|jsx|mjs|ts|tsx)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
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
    new CopyWebpackPlugin([
      {
        from: paths.appPublic,
        to: paths.appBuild,
      },
    ]),
    new CheckerPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      watch: paths.appSrc,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint,
    }),
    new Serve({
      open: true,
      port: 8080,
      host: 'localhost',
      hmr: true,
      historyFallback: true,
      static: paths.appBuild,
      middleware: (app, builtins) => {
        // app.use(builtins.proxy('/api', { target: 'http://localhost:8081' }));
      },
    }),
  ],
  watch: true,
};
