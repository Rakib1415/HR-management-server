const db = require('../models');

const User = db.users;

const findUserByProperty = (key, value) => {
    if (key === 'id') {
        return User.findByPk(value);
    }
    return User.findOne({ where: { [key]: value } });
};

const createNewUser = ({ name, email, password }) =>
    User.create({
        name,
        email,
        password,
    });

module.exports = {
    findUserByProperty,
    createNewUser,
};
