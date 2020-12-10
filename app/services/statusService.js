const { httpStatus, serverStatus } = require('../constants');

/**
 * Verity ctx
 * @param {import('../server/middlewares').ContextStd} ctx
 * @returns {('UP' | undefined)}
 */
const checkCtx = (ctx) => {
  if (ctx.log && ctx.db && ctx.pool) {
    return serverStatus.UP;
  }
  return undefined;
};

/**
 * ctx check correct
 * @param {import('../server/middlewares').ContextStd} ctx
 * @returns {import('../server/middlewares').ContextStd}
 */
const healthy = (ctx) => {
  const status = checkCtx(ctx);
  if (!status) {
    ctx.status = httpStatus.statusCodes.SERVICE_UNAVAILABLE;
  } else {
    ctx.status = httpStatus.statusCodes.OK;
  }
  ctx.body = {
    status: status || serverStatus.DOWN,
  };
  return ctx;
};

/**
 * Check database and dependency load correct
 * @param {import('../server/middlewares').ContextStd} ctx
 * @returns {import('../server/middlewares').ContextStd}
 */
const alive = (ctx) => {
  const { db, pool } = ctx;
  if (db && db.isConnected() && !pool.haveError()) {
    ctx.body = { status: 'UP' };
    ctx.status = httpStatus.statusCodes.OK;
  } else {
    ctx.status = httpStatus.statusCodes.SERVICE_UNAVAILABLE;
    ctx.body = { status: 'DOWN' };
  }
  return ctx;
};

module.exports = {
  alive,
  healthy,
};
