const Mailgen = require('mailgen');
const bcrypt = require('bcrypt');

const generateMailBody = ({ name, password }) => {
    const mailgenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'HR-Management Application',
            link: 'https://mailgen.js/',
        },
    });
    const response = {
        body: {
            name,
            intro: "Welcome to HR-Management! We're very excited to have you on board.",
            table: {
                data: [{ userName: name, password }],
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };

    const mail = mailgenerator.generate(response);
    return mail;
};

const generateHash = async (saltRound, password) => {
    const salt = await bcrypt.genSalt(saltRound);
    return bcrypt.hash(password, salt);
};

module.exports = {
    generateMailBody,
    generateHash,
};
