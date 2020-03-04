const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const ForkTsChecker = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
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
    new webpack.optimize.SplitChunksPlugin(),
    new ForkTsChecker({
      async: false,
      checkSyntacticErrors: true,
      watch: paths.srcPath,
      tsconfig: paths.tsPath,
      tslint: paths.tsLintPath,
    }),
  ];
  const prodPlugins = [
    require('autoprefixer'),
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
        to: path.resolve(paths.buildPath, 'static'),
      },
    ]),
  ];
  const devPlugins = [
    // 将一些不太可能改动的第三方库单独打包，会通过缓存极大提升打包速度
    new AutoDllPlugin({
      debug: isDev,
      // will inject the DLL bundle to index.html
      // default false
      inject: true,
      filename: '[name].[hash].js',
      path: 'vendor',
      entry: {
        vendor: Object.keys(require('../package.json').dependencies),
      },
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: http:localhost:${env.PORT}`,
        ],
      },
      clearConsole: true,
    }),
    // 热更新相关
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ];

  return isDev ? _plugins.concat(devPlugins) : _plugins.concat(prodPlugins);
}

// TODU 项目大了之后可加入happypack和thread-loader加速构建速度
module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: isDev
    ? [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        path.resolve(paths.srcPath, 'index.tsx'),
      ]
    : path.resolve(paths.srcPath, 'index.tsx'),
  output: {
    path: paths.buildPath,
    filename: 'js/[name].[hash].js',
    publicPath: paths.publicPath,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,
              }),
            ],
          }),
        },
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
              name: 'images/[hash:8].[name].[ext]',
            },
          },
        ],
      },
      // 字体图标啥的，跟图片分处理方式一样
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'font/[hash:8].[name].[ext]',
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
        // use里的loader执行顺序为从下到上，loader的顺序要注意
        // 这里检测到scss/css文件后需要将后续处理loader都写在此use里,如果scss和css过分开检测处理，不能说先用scss-loader转成css，然后让它走/\.css/里的use
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
                // 加载全局的scss文件
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
              javascriptEnabled: true,
            },
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                // 加载全局的less文件
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
      // 这个为src配置别名，非必需，为方便而已
      '@': paths.srcPath,
    },
    // 在import这些拓展名的文件时，可以省略拓展名
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
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-loadable|nprogress|mobx-react-router|mobx-react|mobx|moment)/,
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
