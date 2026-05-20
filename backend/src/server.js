const http = require('http');
const env = require('./config/env');
const logger = require('./config/logger');
const { createApp } = require('./app');
const { createRuntimeContainer } = require('./config/container');
const { connectDatabase } = require('./config/database');
const { registerRealtime } = require('./realtime');

async function startServer() {
  const container = createRuntimeContainer();
  await connectDatabase(container.sequelize);

  const app = createApp({ services: container.services });
  const server = http.createServer(app);

  registerRealtime(server, container);

  await new Promise((resolve) => server.listen(env.port, resolve));
  logger.info('server.started', { port: env.port, environment: env.nodeEnv });

  return { app, server, container };
}

if (require.main === module) {
  startServer().catch((error) => {
    logger.error('server.bootstrap_failed', { message: error.message });
    process.exit(1);
  });
}

module.exports = {
  startServer,
};
