const logger = require('../../utils/logger');

/**
 * Added log to context
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const loggerMiddleware = () => async (ctx, next) => {
  ctx.log = logger;
  await next();
  return ctx;
};

module.exports = loggerMiddleware;
