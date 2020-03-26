const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const ForkTsChecker = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { loadableTransformer } = require('loadable-ts-transformer');
const LoadablePlugin = require('@loadable/webpack-plugin');

const env = require('./env');
const paths = require('./paths');

const isDev = env.NODE_ENV === 'development';

const cssLoader = [
  { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
  { loader: 'css-loader' },
  ...(isDev ? [] : [{ loader: 'postcss-loader' }]),
];

let hash = isDev ? 'hash' : 'contenthash';

function getPlugins() {
  const _plugins = [
    new webpack.optimize.SplitChunksPlugin(),
    new ForkTsChecker({
      async: false,
      checkSyntacticErrors: true,
      watch: paths.srcPath,
      tsconfig: paths.tsPath,
      tslint: paths.tsLintPath,
    }),
    new LoadablePlugin(),
    new webpack.DefinePlugin({
      'process.env.__SERVER__': false,
      'process.env.__CLIENT__': true,
    }),
  ];
  const prodPlugins = [
    require('autoprefixer'),
    new MiniCssExtractPlugin({
      filename: `css/[name].[${hash}].css`,
      chunkFilename: `css/[name].[${hash}].css`,
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
      filename: `vendor.dll.js`,
      entry: {
        vendor: ['react', 'react-dom'],
      },
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [],
      },
      clearConsole: false,
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
    ? {
        [paths.entry]: [
          'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
          path.resolve(paths.srcPath, 'client.tsx'),
        ],
      }
    : { [paths.entry]: path.resolve(paths.srcPath, 'client.tsx') },
  output: {
    path: paths.buildPath,
    filename: `js/[name].[${hash}].js`,
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
          getCustomTransformers: () => ({ before: [loadableTransformer] }),
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
              name: `images/[${hash}].[name].[ext]`,
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
              name: `font/[${hash}].[name].[ext]`,
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
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|mobx|mobx-react)/,
              priority: 100,
              name: 'vendors',
              enforce: true,
            },
            common: {
              chunks: 'all',
              minChunks: 2,
              name: 'commons',
              priority: 80,
            },
          },
        },
      },
};
