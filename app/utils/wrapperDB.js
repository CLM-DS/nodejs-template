const { MongoClient } = require('mongodb');
const logger = require('./logger');
/**
 * Client from Mongo Connection
 * @type {MongoClient}
 */
let client;
/**
 * Database name
 * @type {string}
 */
let dataSource = '';
/**
 * Connect to database
 * @param {import('../config').Config} options
 * @returns {MongoClient}
 */
const connect = (options) => {
  const { mongoUri } = options;
  if (client) {
    return client;
  }
  client = new MongoClient(mongoUri, { useUnifiedTopology: true });
  client.connect((resp) => {
    if (resp && resp.message) {
      logger.error(resp);
    } else {
      dataSource = options.dataSource;
      logger.info('DB Connection Success');
    }
  });
  return client;
};

/**
 * Find one document in collection
 * @param {string} collection
 * @param {import('mongodb').FilterQuery} query
 * @returns {*}
 */
const findOne = async (collection, query = {}) => {
  const database = await client.db(dataSource);
  return database.collection(collection).findOne(query);
};

/**
 * Find all document in collection
 * @param {string} collection
 * @param {import('mongodb').FilterQuery} query
 * @returns {[*]}
 */
const find = async (collection, query = {}) => {
  const database = await client.db(dataSource);
  return database.collection(collection).find(query).toArray();
};

/**
 * Create document in collection
 * @param {string} collection
 * @param {*} data
 * @returns {import('mongodb').InsertOneWriteOpResult}
 */
const create = async (collection, data) => {
  const database = await client.db(dataSource);
  return database.collection(collection).insertOne(data);
};

module.exports = {
  create,
  find,
  findOne,
  connect,
  client,
};
