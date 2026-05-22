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
    profilePhoto: user.profilePhoto || null,
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

function createAuthService({ userRepository, connectionRepository }) {
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
    async listUsers(currentUserId) {
      const users = await userRepository.listAll();
      const publicUsers = users.map(toPublicUser);

      if (!currentUserId || !connectionRepository) {
        return publicUsers.map(u => ({ ...u, mutualConnectionsCount: 0 }));
      }

      // Pre-calculate friends for all users
      const allAccepted = await connectionRepository.listAllAccepted();
      
      const friendsMap = new Map();
      for (const conn of allAccepted) {
        const reqId = Number(conn.requesterId);
        const recId = Number(conn.receiverId);
        
        if (!friendsMap.has(reqId)) friendsMap.set(reqId, new Set());
        if (!friendsMap.has(recId)) friendsMap.set(recId, new Set());
        
        friendsMap.get(reqId).add(recId);
        friendsMap.get(recId).add(reqId);
      }

      const currentUserFriends = friendsMap.get(Number(currentUserId)) || new Set();

      return publicUsers.map(u => {
        const uId = Number(u.id);
        const otherUserFriends = friendsMap.get(uId) || new Set();
        
        let mutualCount = 0;
        for (const friendId of otherUserFriends) {
          if (currentUserFriends.has(friendId)) {
            mutualCount++;
          }
        }

        return {
          ...u,
          mutualConnectionsCount: mutualCount
        };
      });
    },
    async getUserProfile(id, currentUserId) {
      const user = await userRepository.findById(id);
      if (!user) {
        throw new NotFoundError('User not found.');
      }
      
      const safeUser = toPublicUser(user);
      
      // Calculate mutual connections if currentUserId is provided and different
      if (currentUserId && currentUserId !== Number(id) && connectionRepository) {
        const allConnections = await connectionRepository.listAllAccepted();
        
        const adj = new Map();
        for (const conn of allConnections) {
          const reqId = Number(conn.requesterId);
          const recId = Number(conn.receiverId);
          if (!adj.has(reqId)) adj.set(reqId, new Set());
          if (!adj.has(recId)) adj.set(recId, new Set());
          adj.get(reqId).add(recId);
          adj.get(recId).add(reqId);
        }

        const myFriends = adj.get(Number(currentUserId)) || new Set();
        const theirFriends = adj.get(Number(id)) || new Set();
        
        let mutual = 0;
        for (const friendId of theirFriends) {
          if (myFriends.has(friendId)) mutual++;
        }
        safeUser.mutualConnectionsCount = mutual;
      } else {
        safeUser.mutualConnectionsCount = 0;
      }

      return safeUser;
    },
    async updatePreferences(userId, payload) {
      const user = await userRepository.updatePreferences(userId, payload);
      return toPublicUser(user);
    },
    async updateResumeUrl(userId, resumeUrl) {
      const user = await userRepository.updateResumeUrl(userId, resumeUrl);
      return toPublicUser(user);
    },
    async updateProfilePhoto(userId, photoUrl) {
      await userRepository.updateProfilePhoto(userId, photoUrl);
      const user = await userRepository.findById(userId);
      return toPublicUser(user);
    },
  };
}

module.exports = {
  createAuthService,
};
