const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const db = require('../models');
const { findEmployeeByProperty } = require('../services/employee');

const User = db.users;
const Admin = db.admins;

const authenticate = async (req, _res, next) => {
    let token = req.headers.authorization;
    try {
        if (!token) {
            throw createError(401, 'unauthorized');
        }

        token = token.split(' ');
        const decoded = jwt.verify(token[1], 'secret-key');
        console.log(token[1]);
        if ('userId' in decoded) {
            const employee = await findEmployeeByProperty('userId', decoded.userId);
            if (!employee) {
                throw createError(401, 'unauthorized');
            }
            req.employee = employee;
        }
        if ('adminId' in decoded) {
            const admin = await Admin.findOne({
                include: [{ model: User, as: 'user' }],
                where: { id: decoded.adminId },
            });
            if (!admin) {
                throw createError(401, 'unauthorized');
            }
            req.admin = admin;
        }
        return next();
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

module.exports = authenticate;
