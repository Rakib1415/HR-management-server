const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { loginService } = require('../services/admin');
const { findUserByProperty } = require('../services/user');
const { generateHash } = require('../utils');
const db = require('../models');

const AbsenceRequest = db.absenceRequests;
const AbsenceStatus = db.absenceStatuses;
const Employee = db.employees;
const User = db.users;

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const token = await loginService({ email, password, isAdmin: false });
        return res.status(200).json({ message: 'login successfully', token });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const resetPassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await findUserByProperty('id', req.employee.userId);
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw createError(401, 'password does not match');
        }
        // const salt = await bcrypt.genSalt(10);
        // const hashPassword = await bcrypt.hash(newPassword, salt);
        user.password = await generateHash(10, newPassword);
        await user.save();
        res.status(200).json({ message: 'success' });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const createAbsenceRequest = async (req, res, next) => {
    const { startDate, endDate, reason } = req.body;
    try {
        const absenceStatus = await AbsenceStatus.create();
        const absenceRequest = await AbsenceRequest.create({
            startDate,
            endDate,
            reason,
            employeeId: req.employee.id,
            absenceStatusId: absenceStatus.id,
        });
        res.status(200).json({ message: 'success', absenceRequest });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const getAllAbsenceRequest = async (req, res, next) => {
    try {
        const absenceRequests = await AbsenceRequest.findAll({
            include: [
                { model: AbsenceStatus, as: 'absenceStatus' },
                {
                    model: Employee,
                    as: 'employee',
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                    ],
                },
            ],
            where: { employeeId: req.employee.id },
        });
        const transformAbsenceRequests = absenceRequests.map((absenceRequest) => ({
            id: absenceRequest.id,
            startDate: absenceRequest.startDate,
            endDate: absenceRequest.endDate,
            reason: absenceRequest.reason,
            status: absenceRequest.absenceStatus.status,
            name: absenceRequest.employee.user.name,
            email: absenceRequest.employee.user.email,
        }));
        res.status(200).json({ message: 'success', absenceRequests: transformAbsenceRequests });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const updateAbsenceRequestById = async (req, res, next) => {
    const { id } = req.params;
    const { startData, endDate, reason } = req.body;
    try {
        const absenceRequest = await AbsenceRequest.findOne({
            where: {
                employeeId: req.employee.id,
                id,
            },
        });
        if (!absenceRequest) {
            throw createError(401, 'There is no absence request corresponding this id');
        }
        absenceRequest.startData = startData || absenceRequest.startData;
        absenceRequest.endDate = endDate || absenceRequest.endDate;
        absenceRequest.reason = reason || absenceRequest.reason;
        await absenceRequest.save();
        res.status(200).json({ message: 'successfully Updated!' });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const deleteAbsenceRequestById = async (req, res, next) => {
    const { id } = req.params;
    try {
        await AbsenceStatus.destroy({
            where: {
                id,
            },
        });
        await AbsenceRequest.destroy({
            where: {
                id,
            },
        });
        res.status(200).json({ message: 'success' });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

module.exports = {
    login,
    resetPassword,
    createAbsenceRequest,
    getAllAbsenceRequest,
    updateAbsenceRequestById,
    deleteAbsenceRequestById,
};
