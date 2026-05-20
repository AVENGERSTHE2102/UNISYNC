const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { ConflictError, AuthenticationError } = require('../utils/appError');

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    yearOfStudy: user.yearOfStudy,
    branch: user.branch,
    company: user.company,
    professionalRole: user.professionalRole,
    interests: user.interests || [],
  };
}

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function createAuthService({ userRepository }) {
  return {
    async signup(payload) {
      const existingUser = await userRepository.findByEmail(payload.email);

      if (existingUser) {
        throw new ConflictError('A user with this email already exists.');
      }

      const passwordHash = await bcrypt.hash(payload.password, 10);
      const user = await userRepository.create({
        name: payload.name,
        email: payload.email,
        passwordHash,
        role: payload.role,
        yearOfStudy: payload.yearOfStudy,
        branch: payload.branch,
        company: payload.company,
        professionalRole: payload.professionalRole,
        interests: payload.interests,
      });

      const publicUser = toPublicUser(user);

      return {
        user: publicUser,
        token: issueToken(publicUser),
      };
    },
    async login({ email, password }) {
      const user = await userRepository.findByEmail(email);

      if (!user) {
        throw new AuthenticationError('Invalid email or password.');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        throw new AuthenticationError('Invalid email or password.');
      }

      const publicUser = toPublicUser(user);

      return {
        user: publicUser,
        token: issueToken(publicUser),
      };
    },
    async getCurrentUser(userId) {
      const user = await userRepository.findById(userId);
      return user ? toPublicUser(user) : null;
    },
    async listUsers() {
      const users = await userRepository.listAll();
      return users.map(toPublicUser);
    },
  };
}

module.exports = {
  createAuthService,
};
