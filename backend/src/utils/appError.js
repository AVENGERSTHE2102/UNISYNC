class AppError extends Error {
  constructor(message, { statusCode = 500, code = 'INTERNAL_ERROR', meta } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.meta = meta;
  }
}

class ValidationError extends AppError {
  constructor(message, meta) {
    super(message, { statusCode: 400, code: 'VALIDATION_ERROR', meta });
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', meta) {
    super(message, { statusCode: 401, code: 'AUTH_REQUIRED', meta });
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Forbidden', meta) {
    super(message, { statusCode: 403, code: 'FORBIDDEN', meta });
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', meta) {
    super(message, { statusCode: 404, code: 'NOT_FOUND', meta });
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict', meta) {
    super(message, { statusCode: 409, code: 'CONFLICT', meta });
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
};
