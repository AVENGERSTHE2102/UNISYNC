const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

module.exports = sequelize; // Export the Sequelize instance for use in other parts of the application