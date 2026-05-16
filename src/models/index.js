const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.js')(sequelize, Sequelize);
db.Event = require('./event.js')(sequelize, Sequelize);
db.Mentorship = require('./mentorship.js')(sequelize, Sequelize);
db.Job = require('./job.js')(sequelize, Sequelize);
db.Community = require('./community.js')(sequelize, Sequelize);
db.Thread = require('./thread.js')(sequelize, Sequelize);
db.Reply = require('./reply.js')(sequelize, Sequelize);

// Define associations here

db.Thread.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.Thread, { foreignKey: 'userId' });

db.Reply.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.Reply, { foreignKey: 'userId' });

db.Reply.belongsTo(db.Thread, { foreignKey: 'threadId' });
db.Thread.hasMany(db.Reply, { foreignKey: 'threadId' });

db.Thread.belongsTo(db.Community, { foreignKey: 'communityId' });
db.Community.hasMany(db.Thread, { foreignKey: 'communityId' });

module.exports = db;