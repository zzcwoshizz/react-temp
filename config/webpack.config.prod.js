'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const paths = require('./paths');
const publicPath = '/';

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname),

  /**
   * entry
   */
  entry: {
    index: path.resolve(paths.appSrc, 'index.tsx'),
  },
  output: {
    filename: 'static/js/[name].[hash:8].js',
    publicPath: publicPath,
    path: paths.appBuild,
  },
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
            loader: ExtractTextPlugin.extract({
              fallback: {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: false,
                },
              },
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    // Necessary for external CSS imports to work
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9', // React doesn't support IE8 anyway
                        ],
                        flexbox: 'no-2009',
                      }),
                    ],
                  },
                },
                {
                  loader: 'sass-loader', // compiles Sass to CSS
                  options: {
                    includePaths: [path.resolve(paths.appSrc, 'scss')],
                  },
                },
              ],
            }),
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
              fallback: {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: false,
                },
              },
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    // Necessary for external CSS imports to work
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9', // React doesn't support IE8 anyway
                        ],
                        flexbox: 'no-2009',
                      }),
                    ],
                  },
                },
              ],
            }),
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
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
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
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: paths.appSrc,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint,
    }),
    new CleanWebpackPlugin(['*'], {
      root: paths.appBuild,
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:8].css',
    }),
  ],
};
