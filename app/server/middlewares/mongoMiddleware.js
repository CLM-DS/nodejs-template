const { MongoClient } = require('mongodb');
const logger = require('../../utils/logger');

const mongoUri = process.env.MONGO_URI;

let client;
const connection = (() => {
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
})();

const mongoMiddleware = () => (ctx, next) => {
  ctx.db = connection;
  next();
};

module.exports = mongoMiddleware;
