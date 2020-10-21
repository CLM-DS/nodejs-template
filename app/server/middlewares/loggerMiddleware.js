const logger = require('../../utils/logger');

const loggerMiddleware = () => (ctx, next) => {
  ctx.log = logger;
  next();
  return ctx;
};

module.exports = loggerMiddleware;
