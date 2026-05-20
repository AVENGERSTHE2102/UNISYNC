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
  };
}

module.exports = {
  createUserRepository,
};
