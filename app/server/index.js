const Koa = require('koa');
const { connect } = require('../utils/wrapperDB');
const { useRoutes } = require('../routes');
const { useMiddleware } = require('./middlewares');
const logger = require('../utils/logger');
const { useListeners } = require('../listeners');

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
  // create connection to database
  const connection = connect(options);
  // create connection to broker and listener message
  const broker = useListeners({
    options,
    db: connection,
  });
  // load middleware to app
  useMiddleware({
    options,
    app,
    broker,
    db: connection,
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
  app.removeAllListeners();
};

module.exports = {
  startServer,
  stopServer,
};
