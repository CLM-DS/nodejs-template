const { healthy, alive } = require('../services/statusService');

const handlerHealthy = (ctx) => healthy(ctx);

const handlerAlive = (ctx) => alive(ctx);

module.exports = {
  handlerHealthy,
  handlerAlive,
};
