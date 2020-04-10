module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  API_PATH:
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1/api'
      : 'http://127.0.0.1/api',
};
