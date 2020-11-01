const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const env = require('./env');
const paths = require('./paths');

const isDev = env.NODE_ENV === 'development';

const cssLoader = [
  { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
  { loader: 'css-loader' },
  ...(isDev ? [] : [{ loader: 'postcss-loader' }]),
];

function getPlugins() {
  const _plugins = [
    new HtmlWebpackPlugin({
      template: paths.htmlPath,
      filename: 'index.html',
      title: require('../package.json').name,
      inject: true,
      minify: !isDev,
    }),
    new ESLintPlugin({
      files: ['src'],
      extensions: ['tsx', 'ts', 'js'],
    }),
  ];
  const prodPlugins = [
    require('autoprefixer'),
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, '../'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[fullhash].css',
      chunkFilename: 'css/[name].[fullhash].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: paths.buildPath,
        },
      ],
    }),
  ];
  const devPlugins = [
    new webpack.HotModuleReplacementPlugin(),
  ];

  return isDev ? _plugins.concat(devPlugins) : _plugins.concat(prodPlugins);
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: isDev
    ? [
        path.resolve(paths.srcPath, 'index.tsx'),
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&overlay=true&reload=true',
      ]
    : path.resolve(paths.srcPath, 'index.tsx'),
  output: {
    path: paths.buildPath,
    filename: 'js/[name].[fullhash].js',
    publicPath: paths.publicPath,
  },
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.(js|ts|tsx)$/,
        use: [
          require.resolve('thread-loader'),
          {
            loader: require.resolve('babel-loader'),
          },
        ],
      },
      {
        test: /\.(png|jpg|jfif|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 低于这个limit就直接转成base64插入到style里，不然以name的方式命名存放
              // 这里的单位时bit
              limit: 8192,
              name: 'images/[fullhash].[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'font/[fullhash].[name].[ext]',
            },
          },
        ],
      },
      {
        // css
        test: /\.css$/,
        use: cssLoader,
      },
      {
        // scss sass
        test: /\.s(c|a)ss$/,
        use: [
          ...cssLoader,
          {
            loader: 'sass-loader',
            options: { implementation: require('sass') },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                // path.resolve(__dirname, '../src/assets/styles/_variables.scss'),
              ],
            },
          },
        ],
      },
      {
        // less
        test: /\.less$/,
        use: [
          ...cssLoader,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                // path.resolve(__dirname, '../src/assets/styles/_variables.less'),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: getPlugins(),
  resolve: {
    alias: {
      '@': paths.srcPath,
    },
    extensions: ['*', '.js', '.json', '.ts', '.tsx'],
  },
  optimization: isDev
    ? undefined
    : {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendors: {
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-loadable|nprogress|moment)/,
              priority: 100,
              name: 'vendors',
            },
            antd: {
              chunks: 'all',
              test: /[\\/]node_modules[\\/]antd/,
              priority: 90,
              name: 'antd',
            },
            commons: {
              chunks: 'all',
              minChunks: 2,
              name: 'commons',
              priority: 80,
            },
          },
        },
      },
};
