const broker = require('../utils/wrapperBroker');

/**
 * Configure all middleware to application
 * @param {*} args
 * @returns {broker}
 */
const useListeners = (args = {}) => {
  if (args.broker) {
    broker.initBroker(args);
    return broker;
  }
  return undefined;
};

module.exports = {
  useListeners,
};
