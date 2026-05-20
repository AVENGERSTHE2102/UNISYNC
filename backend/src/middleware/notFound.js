const { NotFoundError } = require('../utils/appError');

module.exports = function notFound(req, res, next) {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};
