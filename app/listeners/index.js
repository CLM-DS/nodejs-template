const { createBroker, createPool } = require('../utils/broker');
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

/**
 *
 * @param {import('../utils/broker').PoolBroker} pool
 */
const buildListener = async (pool, args) => {
  const broker = pool.getBroker('kafka');

  // this is code from example
  const listenerConfig = {
    topic: 'topic-dummy',
    onMessage: createContextMessage(args, (message) => {
      args.log.info(message);
    }),
    onError: createContextMessage(args, (err) => {
      args.log.error(err);
    }),
  };
  // example from broker listener event
  await broker.consumer.addListener(listenerConfig);
};

const createBrokers = (args) => {
  const { options } = args;
  const pool = createPool();
  // example from broker created
  // this is code from example
  pool.addBroker('kafka-1', createBroker(options.brokerConfig.kafka1));
  pool.addBroker('kafka-2', createBroker(options.brokerConfig.kafka2));
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
    buildListener(pool)
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
