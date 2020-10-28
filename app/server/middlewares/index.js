const configMiddleware = require('./configMiddleware');
const errorMiddleware = require('./errorMiddleware');
const loggerMiddleware = require('./loggerMiddleware');
const mongoMiddleware = require('./mongoMiddleware');
const monitorMiddleware = require('./monitorMiddleware');

/**
 * @typedef {Object} Argument
 * @property {import('koa')} app
 * @property {import('../../config').Config} options
 */

/**
  * @typedef {Object} ContextGeneric
  * @property {import('../../config').Config} config
  * @property {import('pino').Logger} log
  * @property {import('mongodb').MongoClient} db
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
  const { app, options } = args;
  // errorMiddleware must not move, this must be the first middleware to be used
  app.use(errorMiddleware(app));
  app.use(configMiddleware());
  app.use(loggerMiddleware());
  app.use(monitorMiddleware());
  app.use(mongoMiddleware(options));
  return app;
};

module.exports = {
  useMiddleware,
};
