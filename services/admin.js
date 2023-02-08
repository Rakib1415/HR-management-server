const createError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { findUserByProperty, createNewUser } = require('./user');
const db = require('../models');
const { generateMailBody, generateHash } = require('../utils');

const Admin = db.admins;
const AbsenceStatus = db.absenceStatuses;

const registerService = async ({ name, email, password }) => {
    const user = await findUserByProperty('email', email);
    if (user) {
        throw createError(400, 'user already exist!');
    }
    const hashPassword = await generateHash(10, password);
    return createNewUser({
        name,
        email,
        password: hashPassword,
    });
};

const loginService = async ({ email, password, isAdmin }) => {
    // Find the user with the provided email
    const user = await findUserByProperty('email', email);
    if (!user) {
        throw createError(401, 'invalid email or password');
    }
    // Compare the provided password to the stored password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError(401, 'invalid email or password');
    }

    if (isAdmin) {
        // check if the user is an admin
        const admin = await Admin.findOne({ where: { userId: user.id } });
        if (!admin) {
            throw createError(403, 'Not authorized as an admin');
        }

        // generate a jwt token for the admin
        const token = jwt.sign({ adminId: admin.id }, 'secret-key', {
            expiresIn: '7d',
        });
        return {
            jwt: token,
            user: {
                username: user.name,
                email: user.email,
            },
        };
    }
    if (!isAdmin) {
        const token = jwt.sign({ userId: user.id }, 'secret-key', {
            expiresIn: '7d',
        });
        return {
            jwt: token,
            user: {
                username: user.name,
                email: user.email,
            },
        };
    }
};

const sendEmailToEmployee = ({ name, email, password }) => {
    const config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: 'wlgkxpflvdwikahz',
        },
    };
    // Create a transporter object
    const transporter = nodemailer.createTransport(config);

    // Define the email options
    const mailOptions = {
        from: 'rakibiueeetest@gmail.com',
        to: email,
        subject: 'Account credentials',
        html: generateMailBody({ name, password }), // html body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw createError(500, error.message);
        }
    });
};

const updatedAbsenceStatus = async ({ id, name, status }) => {
    const absenceStatus = await AbsenceStatus.findByPk(id);
    if (!absenceStatus) {
        throw createError(401, 'There is no absence status corrosponding your id');
    }
    absenceStatus.status = status;
    absenceStatus.updatedBy = name;
    return absenceStatus.save();
};

module.exports = {
    registerService,
    loginService,
    sendEmailToEmployee,
    updatedAbsenceStatus,
};
