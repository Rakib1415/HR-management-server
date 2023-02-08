const db = require('../models');

const Employee = db.employees;
const User = db.users;

const findEmployeeByProperty = (key, value) =>
    Employee.findOne({ include: [{ model: User, as: 'user' }], where: { [key]: value } });

module.exports = {
    findEmployeeByProperty,
};
