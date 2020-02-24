const path = require('path');

module.exports = {
  // devserver启动服务的根路径
  open: true,
  port: 3000,
  quiet: true,
  hot: true,
  historyApiFallback: true,
  clientLogLevel: 'none',
  overlay: {
    warnings: false,
    errors: true,
  },
  noInfo: true,
  stats: 'none',
  disableHostCheck: true,
  contentBase: path.resolve(__dirname, '..'),
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      secure: false,
      pathRewrite: { '^/api': '' },
    },
  },
};
