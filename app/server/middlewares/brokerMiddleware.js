/**
 * Added Config to context
 * @param {import('../../utils/broker').PoolBroker} pool
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const brokerMiddleware = (pool) => async (ctx, next) => {
  ctx.pool = pool;
  await next();
  return ctx;
};

module.exports = brokerMiddleware;
