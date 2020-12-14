const statusRoute = require('./statusRoute');

/**
 * create route in server koa
 * @param {*} app koa instance server
 * @param {*} router koa router instance
 * @param {*} options app options globals
 */
const useRoute = (app, router, options) => {
  const { prefix } = options;
  router.prefix(prefix);
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
};
/**
 * Load all routes in app
 * @param {*} args
 */
const useRoutes = (args = {}) => {
  const { app, options } = args;
  useRoute(app, statusRoute, options);
  args.log.info('Routes Loaded');
  return app;
};

module.exports = {
  useRoutes,
};
