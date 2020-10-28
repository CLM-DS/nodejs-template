const Koa = require('koa');
const { useRoutes } = require('../routes');
const { useMiddleware } = require('./middlewares');
const logger = require('../utils/logger');

/**
 * @type {import('koa')}
 */
let app;

/**
 *
 * @param {import('../config').Config} options
 * @returns {import('koa')}
 */
const startServer = (options = {}) => {
  logger.info('Server Initialize');
  app = new Koa();
  // load middleware to app
  useMiddleware({
    options,
    app,
  });
  logger.info('Server Middleware Loaded');
  // load routes to app
  useRoutes({
    options,
    app,
  });
  logger.info('Server Routes Loaded');
  app.listen(options.port, () => {
    logger.info(`Server Listen Port: ${options.port}`);
  });
  logger.info('Server Loaded');
  return app;
};

/**
 * Stop application active
 */
const stopServer = () => {
  app.removeAllListener();
};

module.exports = {
  startServer,
  stopServer,
};
