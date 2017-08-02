module.exports = {
  host: '127.0.0.1',
  port: process.env.POSTGRES_PORT || 5616,
  user: process.env.POSTGRES_USER || 'knorm',
  password: process.env.POSTGRES_PASSWORD || 'knorm',
  database: process.env.POSTGRES_DB || 'knorm'
};
