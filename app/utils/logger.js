const Pino = require('pino');

const env = process.env.NODE_ENV || 'development';
const name = process.env.APP_NAME;

const options = {
  enabled: process.env.LOG_ENABLED || (
    ['production', 'development'].includes(env)
  ),
  name,
  level: process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug'),
  customLevels: { healthy: 0 },
  redact: [],
};

const logger = Pino(options);

module.exports = logger;
