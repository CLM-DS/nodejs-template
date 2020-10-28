const { statusCodes } = require('../../constants/httpStatus');
const logger = require('../../utils/logger');

/**
 * Handler from error
 * @param {Error} err
 * @param {import('./index').ContextStd} ctx
 */
const handlerError = (err, ctx) => {
  logger.error({
    req: ctx.request,
    err,
  });
};

/**
 * Added Handler Error to Application
 * @param {import('koa')} app
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const errorMiddleware = (app) => {
  app.on('error', handlerError);
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = statusCodes.INTERNAL_SERVER_ERROR;
      ctx.app.emit('error', err, ctx);
    }
  };
};

module.exports = errorMiddleware;
