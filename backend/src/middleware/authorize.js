const { AuthorizationError } = require('../utils/appError');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('Missing authenticated user.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError('Insufficient role for this action.'));
    }

    return next();
  };
}

module.exports = {
  authorize,
};
