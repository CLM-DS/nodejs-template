const { connect } = require('../../utils/wrapperDB');

/**
 * Added mongo client
 * @param {import('../../config').Config} options
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const mongoMiddleware = (options) => {
  connect(options);
  return async (ctx, next) => {
    ctx.db = connect(options);
    await next();
    return ctx;
  };
};

module.exports = mongoMiddleware;
