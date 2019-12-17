const path = require('path');

module.exports = {
  // devserver启动服务的根路径
  contentBase: path.resolve(__dirname, '../dist'),
  open: true,
  openPage: '',
  port: 3000,
  quiet: true,
  hot: true,
  allowedHosts: ['0.0.0.0'],
  clientLogLevel: 'none',
  historyApiFallback: true,
  overlay: {
    warnings: false,
    errors: true,
  },
  disableHostCheck: true,
  contentBase: path.resolve(__dirname, '../static'),
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      secure: false,
      pathRewrite: { '^/api': '' },
    },
  },
};
