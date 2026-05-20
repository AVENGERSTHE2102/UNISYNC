const logger = require('../config/logger');
const { AppError } = require('../utils/appError');

module.exports = function errorHandler(err, req, res, next) {
  const error = err instanceof AppError ? err : new AppError(err.message || 'Internal server error');

  logger.error('request.failed', {
    reqId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode: error.statusCode,
    code: error.code,
    message: error.message,
    meta: error.meta,
  });

  res.status(error.statusCode).json({
    ok: false,
    message: error.message,
    code: error.code,
    meta: error.meta,
    reqId: req.id,
  });
};
