const config = require('../../config');

const configMiddleware = () => (ctx, next) => {
  ctx.config = config;
  next();
};

module.exports = configMiddleware;
