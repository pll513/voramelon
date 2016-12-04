var config;

config = {
  mongodb: {
    user: 'admin',
    pass: 'admin',
    db: 'voramelon',
    port: 27017,
    url: 'mongodb://admin:admin@localhost:27017/voramelon'
  },
  path: __dirname,
  host: 'localhost',
  port: 3000
};

module.exports = config;