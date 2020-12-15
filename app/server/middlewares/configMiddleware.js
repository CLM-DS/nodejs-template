/**
 * Added Config to context
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const configMiddleware = (options) => async (ctx, next) => {
  ctx.config = options;
  await next();
  return ctx;
};

module.exports = configMiddleware;
