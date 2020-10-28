const config = require('../../config');

/**
 * Added Config to context
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const configMiddleware = () => async (ctx, next) => {
  ctx.config = config;
  await next();
  return ctx;
};

module.exports = configMiddleware;
