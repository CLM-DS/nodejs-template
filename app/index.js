require('dotenv').config();
const { startServer } = require('./server');
const { loadSecrets } = require('./config/secretManager');
const { loadConfig } = require('./config');

const run = async () => {
  // set secrets used in app
  const keysKnown = [];
  const secrets = await loadSecrets({
    env: process.env.APP_ENV || 'qa',
    project: process.env.PROJECT,
    version: process.env.VERSION || 'latest',
    keys: keySecrets,
  }, process.env.MODE || 'offline');
  const config = loadConfig(secrets);
  startServer(config);
};

run();
