const logger = require('../../utils/logger');

/**
 * Added log to context
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const loggerMiddleware = () => async (ctx, next) => {
  const { config = {} } = ctx;
  ctx.log = logger.createLogger(config.log);
  await next();
  return ctx;
};

module.exports = loggerMiddleware;
