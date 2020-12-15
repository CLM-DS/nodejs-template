const { createContextMessage } = require('./index');
/**
 *
 * @param {import('../utils/broker').PoolBroker} pool
 */
const createListener = async (pool, args) => {
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

module.exports = {
  createListener,
};
