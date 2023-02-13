module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    dialect: 'postgres',
    PGPORT: '5432',
    pool: {
        max: 5,
        min: 0,
        acquire: 1000000,
        idle: 100000,
    },
};
