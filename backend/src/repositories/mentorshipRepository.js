function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createMentorshipRepository(models) {
  const { Mentorship, User, MentorshipGoal } = models;
  const { Op } = require('sequelize');

  return {
    async createRequest({ studentId, mentorId, compatibilityScore = 0 }) {
      const record = await Mentorship.create({
        studentId,
        mentorId,
        compatibilityScore,
        status: 'pending',
      });
      return toPlain(record);
    },

    async findById(id) {
      const record = await Mentorship.findByPk(id, {
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'email', 'role', 'yearOfStudy', 'branch', 'interests'],
          },
          {
            model: User,
            as: 'mentor',
            attributes: ['id', 'name', 'email', 'role', 'company', 'professionalRole', 'interests'],
          },
        ],
      });
      return toPlain(record);
    },

    async findExisting(studentId, mentorId) {
      const record = await Mentorship.findOne({
        where: { studentId, mentorId },
      });
      return toPlain(record);
    },

    async listUserMentorships(userId) {
      const records = await Mentorship.findAll({
        where: {
          [Op.or]: [{ studentId: userId }, { mentorId: userId }],
        },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'email', 'role', 'yearOfStudy', 'branch', 'interests'],
          },
          {
            model: User,
            as: 'mentor',
            attributes: ['id', 'name', 'email', 'role', 'company', 'professionalRole', 'interests'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return records.map(toPlain);
    },

    async updateStatus(id, status) {
      const record = await Mentorship.findByPk(id);
      if (!record) return null;
      record.status = status;
      await record.save();
      return toPlain(record);
    },
    async createGoal(userId, payload) {
      return toPlain(await MentorshipGoal.create({
        userId,
        title: payload.title,
        targetDate: payload.targetDate,
        actionPlan: payload.actionPlan,
      }));
    },
    async getGoals(userId) {
      const records = await MentorshipGoal.findAll({ where: { userId } });
      return records.map(toPlain);
    }
  };
}

module.exports = {
  createMentorshipRepository,
};
