const { createBroker, createPool } = require('../utils/broker');

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
  const { options } = args;
  if (
    options
    && options.brokerConfig
    && Object.keys(options.brokerConfig).length > 0
  ) {
    return createBrokers(args);
  }
  return undefined;
};

module.exports = {
  useListeners,
};
