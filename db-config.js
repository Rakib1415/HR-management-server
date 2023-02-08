module.exports = {
    HOST: 'containers-us-west-49.railway.app',
    USER: 'postgres',
    PASSWORD: 'NdXM8IXrkypKHX4TCLNd',
    PGPORT: '6532',
    DB: 'railway',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 1000000,
        idle: 100000,
    },
};
