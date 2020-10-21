require('dotenv').config();

module.exports = {
  prefix: process.env.APP_PREFIX || '',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || '',
};
