/**
 * A config
 * @typedef {Object} Config
 * @property {string} prefix - Prefix Route MicroServices
 * @property {number} port - Port Listen MicroServices
 * @property {string} mongoUri - Mongo URI to connection database
 * @property {string} dataSource - Name Database to select
 */

module.exports = {
  loadConfig: (secrets) => ({
    prefix: process.env.APP_PREFIX || '',
    port: process.env.PORT || 3000,
    mongoUri: secrets.get('MONGO_DB_URL') || '',
    dataSource: secrets.get('DATABASE_NAME') || '',
  }),
};
