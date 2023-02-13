module.exports = {
    HOST: 'containers-us-west-49.railway.app',
    USER: 'postgres',
    PASSWORD: 'NdXM8IXrkypKHX4TCLNd',
    DB: 'railway',
    dialect: 'postgres',
    PGPORT: '6532',
    pool: {
        max: 5,
        min: 0,
        acquire: 1000000,
        idle: 100000,
    },
};
