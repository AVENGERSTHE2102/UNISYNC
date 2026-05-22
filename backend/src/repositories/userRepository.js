function sanitizeUserRecord(user) {
  return user ? user.get({ plain: true }) : null;
}

function createUserRepository({ User }) {
  return {
    async create(payload) {
      const user = await User.create(payload);
      return sanitizeUserRecord(user);
    },
    async findByEmail(email) {
      const user = await User.findOne({ where: { email } });
      return sanitizeUserRecord(user);
    },
    async findById(id) {
      const user = await User.findByPk(id);
      return sanitizeUserRecord(user);
    },
    async listAll() {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role'],
      });
      return users.map(sanitizeUserRecord);
    },
    async listMentors(filters = {}) {
      const { Op } = require('sequelize');
      const where = {
        role: {
          [Op.in]: ['alumni', 'admin']
        }
      };

      if (filters.interest) {
        where.interests = {
          [Op.contains]: [filters.interest]
        };
      }

      const users = await User.findAll({
        where,
        attributes: ['id', 'name', 'email', 'role', 'yearOfStudy', 'branch', 'company', 'professionalRole', 'interests'],
      });
      return users.map(sanitizeUserRecord);
    },
    async updatePreferences(id, payload) {
      await User.update(
        {
          calendarSyncPreferences: payload.calendarSyncPreferences,
          jobAlertPreferences: payload.jobAlertPreferences,
        },
        { where: { id } }
      );
      return this.findById(id);
    },
    async updateResumeUrl(id, resumeUrl) {
      await User.update({ resumeUrl }, { where: { id } });
      return this.findById(id);
    },
    async updateProfilePhoto(id, profilePhoto) {
      await User.update({ profilePhoto }, { where: { id } });
      return this.findById(id);
    }
  };
}

module.exports = {
  createUserRepository,
};
