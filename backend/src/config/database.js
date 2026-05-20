const { Sequelize } = require('sequelize');
const env = require('./env');
const logger = require('./logger');

function createSequelizeInstance() {
  const options = {
    dialect: 'postgres',
    logging: env.dbLogging ? (msg) => logger.debug(msg) : false,
  };

  // Enable SSL if running in production, or if Supabase database url is detected
  if (
    env.nodeEnv === 'production' ||
    env.databaseUrl.includes('supabase') ||
    env.databaseUrl.includes('ssl=true')
  ) {
    options.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    };
  }

  return new Sequelize(env.databaseUrl, options);
}

async function connectDatabase(sequelize) {
  try {
    await sequelize.authenticate();
    logger.info('database.connected');

    if (env.dbSync) {
      await sequelize.sync();
      logger.info('database.synced');
    }
  } catch (error) {
    logger.error('database.connection_failed', { message: error.message });
    throw error;
  }
}

module.exports = {
  createSequelizeInstance,
  connectDatabase,
};
