const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const ForkTsChecker = require('fork-ts-checker-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

// TODU 项目大了之后可加入happypack和thread-loader加速构建速度
module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
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
        use: [
          { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
        ],
      },
      {
        // scss sass
        test: /\.s(c|a)ss$/,
        // use里的loader执行顺序为从下到上，loader的顺序要注意
        // 这里检测到scss/css文件后需要将后续处理loader都写在此use里,如果scss和css过分开检测处理，不能说先用scss-loader转成css，然后让它走/\.css/里的use
        use: [
          { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
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
          { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
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
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src', 'index.html'),
      filename: 'index.html',
      title: 'React Start',
      inject: true,
      minify: !isDev,
    }),
    new webpack.optimize.SplitChunksPlugin(),
    // 将一些不太可能改动的第三方库单独打包，会通过缓存极大提升打包速度
    new AutoDllPlugin({
      debug: isDev,
      // will inject the DLL bundle to index.html
      // default false
      inject: true,
      debug: false,
      filename: '[name].[hash].js',
      path: 'vendor',
      entry: {
        vendor: ['react', 'react-dom'],
      },
    }),
    new ForkTsChecker({
      async: false,
      checkSyntacticErrors: true,
      watch: path.resolve(__dirname, '..', 'src'),
      tsconfig: path.resolve(__dirname, '..', 'tsconfig.json'),
      tslint: path.resolve(__dirname, '..', 'tslint.json'),
    }),
  ],
  resolve: {
    alias: {
      // 这个为src配置别名，非必需，为方便而已
      '@': path.resolve(__dirname, '../src'),
    },
    // 在import这些拓展名的文件时，可以省略拓展名
    extensions: ['*', '.js', '.json', '.ts', '.tsx'],
  },
};
