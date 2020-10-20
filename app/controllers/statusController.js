const { httpStatus } = require('../constants');

const checkCtx = (ctx) => {
  if (ctx.log && ctx.db) {
    return 'UP';
  }
  return undefined;
};

const handlerHealthy = (ctx) => {
  ctx.log.debug('Healthy Request');
  const status = checkCtx(ctx);
  if (!status) {
    ctx.status = httpStatus.statusCodes.SERVICE_UNAVAILABLE;
  }
  ctx.body = {
    status: status || 'DOWN',
  };
  return ctx;
};

const handlerAlive = (ctx) => {
  const { db } = ctx;
  ctx.log.debug('Alive Request');
  if (db && db.isConnected()) {
    ctx.body = { status: 'UP' };
  } else {
    ctx.status = httpStatus.statusCodes.SERVICE_UNAVAILABLE;
    ctx.body = { status: 'DOWN' };
  }
  return ctx;
};

module.exports = {
  handlerHealthy,
  handlerAlive,
};
