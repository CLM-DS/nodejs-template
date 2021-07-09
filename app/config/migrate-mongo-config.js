require('dotenv').config();

const config = {
  mongodb: {
    url: process.env.MONGO_DB_URL,
    databaseName: process.env.MONGO_DB_NAME,
    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting

    },
  },
  migrationsDir: '../migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

module.exports = config;
