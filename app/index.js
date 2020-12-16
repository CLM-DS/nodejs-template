require('dotenv').config();
const { startServer } = require('./server');
const { loadSecrets } = require('./config/secretManager');
const { loadConfig } = require('./config');

const run = async () => {
  const secrets = await loadSecrets({
    env: process.env.NODE_ENV || 'development',
    project: process.env.PROJECT,
    version: process.env.VERSION || 'latest',
  }, process.env.MODE || 'offline');
  const config = loadConfig(secrets);
  startServer(config);
};

run();
