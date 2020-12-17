/**
 * @param {import('../server/middlewares').ContextStd} ctx
 */
const persistAndMove = async (ctx) => {
  try {
    await ctx.db.createBatch(ctx.config.collection, ctx.request.body);
    ctx.status = 200;
    ctx.body = { message: 'Message persisted and moved!' };
    ctx.log.info('Message persisted');
  } catch (error) {
    ctx.log.error(error);
  }
  return ctx;
};

module.exports = {
  persistAndMove,
};
