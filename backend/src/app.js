const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const env = require('./config/env');
const createApiRouter = require('./routes');
const { attachRequestContext, requestLogger } = require('./middleware/requestContext');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

function createApp({ services, staticDir = env.staticDir } = {}) {
  const app = express();

  app.locals.services = services || {};

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(attachRequestContext);
  app.use(requestLogger);

  if (env.serveStatic && staticDir) {
    app.use(express.static(path.resolve(staticDir)));
  }

  app.use('/api', createApiRouter());
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
