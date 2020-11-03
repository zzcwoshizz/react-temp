const base = require('@zzcwoshizz/config/lib/babel')

module.exports = {
  ...base,
  plugins: [...base.plugins, ['babel-plugin-import', { libraryName: 'antd', style: true }]]
}
