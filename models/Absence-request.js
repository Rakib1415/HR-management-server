module.exports = (sequelize, DataTypes) => {
    const AbsenceRequset = sequelize.define(
        'AbsenceRequest',
        {
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: 'Start date is required',
                    },
                },
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: 'End date is required',
                    },
                },
            },
            reason: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: 'Reason is required',
                    },
                },
            },
        },
        { timestamps: true }
    );
    return AbsenceRequset;
};
