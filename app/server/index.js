const Koa = require('koa');
const db = require('../utils/wrapperDB');
const { useRoutes } = require('../routes');
const { useMiddleware } = require('./middlewares');
const { createLogger } = require('../utils/logger');
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
  const logger = createLogger();
  logger.info('Server Initialize');
  app = new Koa();
  // create connection to database
  db.connect(options);
  // create connection to broker and listener message
  const pool = useListeners({
    options,
    db,
    log: logger,
  });
  // load middleware to app
  useMiddleware({
    options,
    app,
    pool,
    db,
  });
  logger.info('Server Middleware Loaded');
  // load routes to app
  useRoutes({
    options,
    app,
    log: logger,
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
