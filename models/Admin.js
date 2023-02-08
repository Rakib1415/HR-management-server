module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define(
        'Admin',
        {
            phoneNumber: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
        },
        { timestamps: true }
    );
    return Admin;
};
