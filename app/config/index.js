const fs = require('fs');
const { logLevel, PrettyConsoleLogger } = require('kafkajs');
require('dotenv').config();

/**
 * A config
 * @typedef {Object} Config
 * @property {string} prefix - Prefix Route MicroServices
 * @property {number} port - Port Listen MicroServices
 * @property {string} mongoUri - Mongo URI to connection database
 * @property {string} dataSource - Name Database to select
 */

const host = 'localhost';

/**
 * @type {Config}
 */
module.exports = {
  prefix: process.env.APP_PREFIX || '',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || '',
  dataSource: process.env.DATABASE_NAME,
  brokerConfig: {
    kafka: {
      type: 'kafka',
      kafkaOption: {
        groupId: 'group-dummy',
        logLevel: logLevel.DEBUG,
        logCreator: PrettyConsoleLogger,
        brokers: [`${host}:9094`, `${host}:9097`, `${host}:9100`],
        clientId: 'group-dummy',
        ssl: {
          servername: 'localhost',
          rejectUnauthorized: false,
          ca: [fs.readFileSync('route cert', 'utf-8')],
        },
        sasl: {
          mechanism: 'plain',
          username: 'test',
          password: 'testtest',
        },
      },
    },
  },
};
