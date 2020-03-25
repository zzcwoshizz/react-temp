const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { loadableTransformer } = require('loadable-ts-transformer');

const env = require('./env');
const paths = require('./paths');

const isDev = env.NODE_ENV === 'development';

const cssLoader = [
  { loader: 'isomorphic-style-loader' },
  { loader: 'css-loader' },
];

let hash = isDev ? 'hash' : 'contenthash';

// TODU 项目大了之后可加入happypack和thread-loader加速构建速度
module.exports = {
  target: 'node',
  node: false,
  mode: isDev ? 'development' : 'production',
  entry: { [paths.entry]: path.resolve(paths.srcPath, 'server.tsx') },
  output: {
    path: paths.buildPath,
    filename: `server.[${hash}].js`,
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
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
  resolve: {
    alias: {
      // 这个为src配置别名，非必需，为方便而已
      '@': paths.srcPath,
    },
    // 在import这些拓展名的文件时，可以省略拓展名
    extensions: ['*', '.js', '.json', '.ts', '.tsx'],
  },
  externals: [nodeExternals()],
};
