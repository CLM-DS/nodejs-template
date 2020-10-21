const configMiddleware = require('./configMiddleware');
const loggerMiddleware = require('./loggerMiddleware');
const mongoMiddleware = require('./mongoMiddleware');
const monitorMiddleware = require('./monitorMiddleware');

const useMiddleware = (args = {}) => {
  const { app, options } = args;
  app.use(configMiddleware());
  app.use(loggerMiddleware());
  app.use(monitorMiddleware());
  app.use(mongoMiddleware(options));
  return app;
};

module.exports = {
  useMiddleware,
  loggerMiddleware,
  monitorMiddleware,
};
