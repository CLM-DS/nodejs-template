const Koa = require('koa');
const { useRoutes } = require('../routes');
const { useMiddleware } = require('./middlewares');
const logger = require('../utils/logger');

let app;
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

const stopServer = () => {
  app.removeAllListener();
};

module.exports = {
  startServer,
  stopServer,
};
