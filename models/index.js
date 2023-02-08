/* eslint-disable import/newline-after-import */
const Sequelize = require('sequelize');
const dbConfig = require('../db-config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require('./User')(sequelize, Sequelize);
db.employees = require('./Employee')(sequelize, Sequelize);
db.admins = require('./Admin')(sequelize, Sequelize);
db.profiles = require('./Profile')(sequelize, Sequelize);
db.absenceRequests = require('./Absence-request')(sequelize, Sequelize);
db.absenceStatuses = require('./Absence-status')(sequelize, Sequelize);

db.users.hasOne(db.employees, { foreignKey: 'userId', as: 'employee' });
db.employees.belongsTo(db.users, { foreignKey: 'userId', as: 'user' });

db.users.hasOne(db.admins, { foreignKey: 'userId', as: 'admin' });
db.admins.belongsTo(db.users, { foreignKey: 'userId', as: 'user' });

db.employees.hasOne(db.profiles, { foreignKey: 'employeeId', as: 'profile' });
db.profiles.belongsTo(db.employees, { foreignKey: 'employeeId', as: 'employee' });

db.employees.hasMany(db.absenceRequests, { foreignKey: 'employeeId', as: 'absenceRequest' });
db.absenceRequests.belongsTo(db.employees, { foreignKey: 'employeeId', as: 'employee' });

db.absenceStatuses.hasOne(db.absenceRequests, {
    foreignKey: 'absenceStatusId',
    as: 'absenceRequest',
});
db.absenceRequests.belongsTo(db.absenceStatuses, {
    foreignKey: 'absenceStatusId',
    as: 'absenceStatus',
});

module.exports = db;
