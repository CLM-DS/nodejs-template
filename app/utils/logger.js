const Pino = require('pino');

const createLogger = (optionsIn = undefined) => {
  const env = process.env.NODE_ENV || 'development';
  const name = process.env.APP_NAME;
  const options = optionsIn || {
    enabled:
      process.env.LOG_ENABLED || ['production', 'development'].includes(env),
    name,
    level: process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug'),
    customLevels: { healthy: 0 },
    redact: [],
  };
  return Pino(options);
};

module.exports = {
  createLogger,
};
