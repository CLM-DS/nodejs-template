const { createBroker, createPool } = require('../utils/broker');
const { createListener } = require('./dummyListener');
/**
 * Injects in each message the information of connection to database and configurations,
 * in the context key
 * @param {*} args object with, db, log and config from app
 * @param {*} onMessage handler to processing event received
 */
const createContextMessage = (args, onMessage) => (msg) => {
  const msgMutable = msg;
  msgMutable.context = args;
  onMessage(msgMutable);
};

const createBrokers = (args) => {
  const { options } = args;
  const pool = createPool();
  const entries = Object.entries(options.brokerConfig);
  entries.forEach((entry) => {
    pool.addBroker(entry[0], createBroker(entry[1]));
  });
  return pool;
};

/**
 * Configure all middleware to application
 * @param {*} args
 * @returns {*}
 */
const useListeners = (args = {}) => {
  const { options, log } = args;
  if (
    options
    && options.brokerConfig
    && Object.keys(options.brokerConfig).length > 0
  ) {
    const pool = createBrokers(args);
    createListener(pool)
      .then()
      .catch((err) => {
        log.error(err);
        pool.setError(err);
      });
    return pool;
  }
  return undefined;
};

module.exports = {
  useListeners,
  createContextMessage,
};
