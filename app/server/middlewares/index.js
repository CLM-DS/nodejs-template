const bodyParse = require('koa-bodyparser');
const configMiddleware = require('./configMiddleware');
const errorMiddleware = require('./errorMiddleware');
const loggerMiddleware = require('./loggerMiddleware');
const mongoMiddleware = require('./mongoMiddleware');
const monitorMiddleware = require('./monitorMiddleware');
const brokerMiddleware = require('./brokerMiddleware');

/**
 * @typedef {Object} Argument
 * @property {import('koa')} app
 * @property {import('../../config').Config} options
 * @property {import('../../utils/broker').PoolBroker} pool
 * @property {import('mongodb').MongoClient} db
 */

/**
 * @typedef {Object} ContextGeneric
 * @property {import('../../config').Config} config
 * @property {import('pino').Logger} log
 * @property {import('mongodb').MongoClient} db
 * @property {import('../../utils/broker').PoolBroker} pool
 */

/**
 * @typedef {ContextGeneric & import('koa').Context} ContextStd
 */

/**
 * Configure all middleware to application
 * @param {Argument} args
 * @returns {import('koa')}
 */
const useMiddleware = (args = {}) => {
  const {
    app,
    options,
    pool,
    db,
  } = args;
  app.use(bodyParse());
  // errorMiddleware must not move, this must be the first middleware to be used
  app.use(errorMiddleware(app));
  app.use(configMiddleware(options));
  app.use(loggerMiddleware());
  app.use(monitorMiddleware());
  // added client mongo to middleware
  app.use(mongoMiddleware(db));
  // added instance to managed broker
  app.use(brokerMiddleware(pool));
  return app;
};

module.exports = {
  useMiddleware,
};
