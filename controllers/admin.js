const createError = require('http-errors');
const db = require('../models');
const {
    registerService,
    loginService,
    sendEmailToEmployee,
    updatedAbsenceStatus,
} = require('../services/admin');
const { findEmployeeByProperty } = require('../services/employee');

const Admin = db.admins;
const Employee = db.employees;
const User = db.users;
const AbsenceRequest = db.absenceRequests;
const AbsenceStatus = db.absenceStatuses;

const register = async (req, res, next) => {
    const { name, email, password, phoneNumber, address } = req.body;
    try {
        const user = await registerService({ name, email, password });
        const admin = await Admin.create({
            phoneNumber,
            address,
            userId: user.id,
        });
        res.status(200).json({
            message: 'success',
            admin,
        });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const token = await loginService({ email, password, isAdmin: true });
        return res.status(200).json({ message: 'login successfully', token });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const createEmployee = async (req, res, next) => {
    const { name, email, password, department, position } = req.body;
    try {
        const user = await registerService({ name, email, password });
        const employee = await Employee.create({
            department,
            position,
            userId: user.id,
        });
        sendEmailToEmployee({ name, email, password });
        res.status(200).json({
            message: 'successfully created employee',
            employee,
        });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const getAllEmployee = async (_req, res, next) => {
    try {
        const employees = await Employee.findAll({ include: [{ model: User, as: 'user' }] });
        const transformEmployees = employees.map((employee) => ({
            id: employee.id,
            department: employee.department,
            position: employee.position,
            name: employee.user.name,
        }));
        return res.status(200).json({ message: 'success', employees: transformEmployees });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const getEmployeeById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const employee = await findEmployeeByProperty('id', id);
        const transformEmployee = {
            id: employee.id,
            name: employee.user.name,
            department: employee.department,
            position: employee.position,
        };
        return res.status(200).json({ message: 'Success', employee: transformEmployee });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const updateEmployee = async (req, res, next) => {
    const { id } = req.params;
    const { name, department, position } = req.body;
    try {
        const modifiedEmployee = await Employee.findOne({
            where: {
                id,
            },
        });
        if (!modifiedEmployee) {
            throw createError(401, 'There is no absence request corresponding this id');
        }
        const modifiedUser = await User.findOne({
            where: {
                id: modifiedEmployee.userId,
            },
        });
        modifiedEmployee.department = department || modifiedEmployee.department;
        modifiedEmployee.position = position || modifiedEmployee.position;
        modifiedUser.name = name || modifiedUser.name;
        await modifiedEmployee.save();
        await modifiedUser.save();
        res.status(200).json({ message: 'successfully Updated!' });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const deleteEmployeeById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const employee = await findEmployeeByProperty('id', id);
        if (!employee) {
            throw createError(401, 'Employee does not exist for this id');
        }
        await User.destroy({
            where: {
                id: employee.userId,
            },
        });

        await Employee.destroy({
            where: {
                id,
            },
        });
        return res.status(200).json({ message: 'success' });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const getAllAbsenceRequest = async (req, res, next) => {
    try {
        const absenceRequests = await AbsenceRequest.findAll({
            include: [
                {
                    model: AbsenceStatus,
                    as: 'absenceStatus',
                },
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

const approveAbsenceStatus = async (req, res, next) => {
    const { id } = req.params;
    try {
        await updatedAbsenceStatus({ id, name: req.admin.user.name, status: 'approve' });
        res.status(200).json({ message: 'success' });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

const rejectAbsenceStatus = async (req, res, next) => {
    const { id } = req.params;
    try {
        await updatedAbsenceStatus({ id, name: req.admin.user.name, status: 'reject' });
        res.status(200).json({ message: 'success' });
    } catch (err) {
        return next(createError(err.status || 500, err.message));
    }
};

module.exports = {
    register,
    login,
    createEmployee,
    getAllEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployeeById,
    getAllAbsenceRequest,
    approveAbsenceStatus,
    rejectAbsenceStatus,
};
