/**
 * Added Config to context
 * @param {import('../../utils/wrapperBroker')} broker
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const brokerMiddleware = (broker) => async (ctx, next) => {
  ctx.config = broker;
  await next();
  return ctx;
};

module.exports = brokerMiddleware;
