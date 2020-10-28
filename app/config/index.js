require('dotenv').config();

/**
 * A config
 * @typedef {Object} Config
 * @property {string} prefix - Prefix Route MicroServices
 * @property {number} port - Port Listen MicroServices
 * @property {string} mongoUri - Mongo URI to connection database
 * @property {string} dataSource - Name Database to select
 */

/**
 * @type {Config}
 */
module.exports = {
  prefix: process.env.APP_PREFIX || '',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || '',
  dataSource: process.env.DATABASE_NAME,
};
