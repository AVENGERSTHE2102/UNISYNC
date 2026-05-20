const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { AuthenticationError } = require('../utils/appError');

function extractBearerToken(req) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7);
}

async function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      throw new AuthenticationError('Missing bearer token.');
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await req.app.locals.services.authService.getCurrentUser(payload.sub);

    if (!user) {
      throw new AuthenticationError('User not found for token.');
    }

    req.auth = payload;
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Invalid or expired token.'));
    }

    return next(error);
  }
}

module.exports = {
  requireAuth,
};
