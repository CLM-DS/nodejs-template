/**
 * Added mongo client
 * @param {import('../../config').Config} options
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const mongoMiddleware = (connection) => async (ctx, next) => {
  ctx.db = connection;
  await next();
  return ctx;
};

module.exports = mongoMiddleware;
