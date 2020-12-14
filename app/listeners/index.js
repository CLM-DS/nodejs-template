const { createBroker, createPool } = require('../utils/broker');

/**
 *
 * @param {import('../utils/broker').PoolBroker} pool
 */
const buildListener = async (pool) => {
  const broker = pool.getBroker('kafka');

  const listenerConfig = {
    topic: 'topic-dummy',
    onMessage: (message) => {
      console.log(message);
    },
    onError: (err) => {
      console.log(err);
    },
  };
  // example from broker listener event
  await broker.consumer.addListener(listenerConfig);
};

const createBrokers = (options) => {
  const pool = createPool();
  // example from broker created
  pool.addBroker('kafka', createBroker(options.brokerConfig.kafka));
  return pool;
};

/**
 * Configure all middleware to application
 * @param {*} args
 * @returns {*}
 */
const useListeners = (args = {}) => {
  const { options, logger } = args;
  if (options && options.brokerConfig && Object.keys(options.brokerConfig).length > 0) {
    const pool = createBrokers(args.options);
    buildListener(pool).then().catch((err) => {
      logger.error(err);
      pool.setError(err);
    });
    return pool;
  }
  return undefined;
};

module.exports = {
  useListeners,
};
