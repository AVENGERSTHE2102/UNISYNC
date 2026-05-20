const { Sequelize } = require('sequelize');

const storage = process.env.NODE_ENV === 'test' ? 'database.test.sqlite' : 'database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storage,
  logging: false // Disable logging in tests for cleaner output
});

module.exports = sequelize;