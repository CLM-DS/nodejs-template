const broker = require('../utils/broker');

const buildListener = (pool) => {

};

const createBrokers = (pool, args) => {
  pool.addBroker('kafka', broker.createBroker(args.broker.kafka));
  pool.addBroker('pubsub', broker.createBroker(args.broker.pubsub));
  pool.addBroker('servicebus', broker.createBroker(args.broker.pubsub));
}
/**
 * Configure all middleware to application
 * @param {*} args
 * @returns {*}
 */
const useListeners = (args = {}) => {
  if (args.broker) {
    const pool = broker.createPool();
    buildListener();
    return pool;
  }
  return undefined;
};

module.exports = {
  useListeners,
};
