const { MongoClient } = require('mongodb');
const { createLogger } = require('./logger');
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
 * @param {boolean} force
 * @returns {MongoClient}
 */
const connect = (options) => {
  const logger = createLogger(options.log);
  const { mongoUri } = options;
  if (!mongoUri) {
    logger.info('no DB URI Detected, skipping connection!');
    return undefined;
  }
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
 * @returns {Promise<*>}
 */
const findOne = (collection, query = {}) => {
  const database = client.db(dataSource);
  return database.collection(collection).findOne(query);
};

/**
 * Find all document in collection
 * @param {string} collection
 * @param {import('mongodb').FilterQuery} query
 * @returns {Promise<[*]>}
 */
const find = (collection, query = {}) => {
  const database = client.db(dataSource);
  return database.collection(collection).find(query).toArray();
};

/**
 * Create one document in collection
 * @param {string} collection
 * @param {*} data
 * @returns {Promise<import('mongodb').InsertOneWriteOpResult>}
 */
const create = (collection, data) => {
  const database = client.db(dataSource);
  return database.collection(collection).insertOne(data);
};

/**
 * Create documents in batch on collection
 * @param {string} collection
 * @param {[*]} data
 * @returns {Promise<import('mongodb').InsertWriteOpResult>}
 */
const createBatch = (collection, data) => {
  const database = client.db(dataSource);
  return database.collection(collection).insertMany(data);
};

/**
 * update one document in collection
 * @param {string} collection
 * @param {*} filter filter to find document
 * @param {*} dataUpdate data partial or complete from document to update
 * @returns {Promise<import('mongodb').UpdateWriteOpResult>}
 */
const update = (collection, filter, dataUpdate) => {
  const database = client.db(dataSource);
  return database.collection(collection).updateOne(filter, dataUpdate);
};

/**
 * update multiple documents in collection
 * @param {string} collection
 * @param {*} filter filter to find document
 * @param {*} data data partial or complete from document to update
 * @returns {Promise<import('mongodb').UpdateWriteOpResult>}
 */
const updateBatch = (collection, filter, dataUpdate) => {
  const database = client.db(dataSource);
  return database.collection(collection).updateMany(filter, dataUpdate);
};

module.exports = {
  create,
  createBatch,
  update,
  updateBatch,
  find,
  findOne,
  connect,
  client,
  dataSource,
};
