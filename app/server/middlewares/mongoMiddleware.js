const { MongoClient } = require('mongodb');
const logger = require('../../utils/logger');

let client;
const connection = (options) => {
  const { mongoUri } = options;
  if (client) {
    return client;
  }
  client = new MongoClient(mongoUri, { useUnifiedTopology: true });
  client.connect((resp) => {
    if (resp.message) {
      logger.error(resp);
    } else {
      logger.success('DB Connection Success');
    }
  });
  return client;
};

const mongoMiddleware = (options) => {
  connection(options);
  return (ctx, next) => {
    ctx.db = connection(options);
    next();
  };
};

module.exports = mongoMiddleware;
