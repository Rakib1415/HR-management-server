module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define(
        'Employee',
        {
            department: {
                type: DataTypes.STRING,
            },
            position: {
                type: DataTypes.STRING,
            },
        },
        { timestamps: true }
    );

    return Employee;
};
