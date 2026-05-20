const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/appError');

module.exports = function validate(validators) {
  return [
    ...validators,
    (req, res, next) => {
      const result = validationResult(req);

      if (result.isEmpty()) {
        return next();
      }

      return next(
        new ValidationError('Request validation failed.', {
          issues: result.array().map((issue) => ({
            field: issue.path,
            message: issue.msg,
          })),
        })
      );
    },
  ];
};
