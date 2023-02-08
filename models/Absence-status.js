module.exports = (sequelize, DataTypes) => {
    const AbsenceStatus = sequelize.define(
        'AbsenceStatus',
        {
            status: {
                type: DataTypes.ENUM,
                values: ['pending', 'approve', 'reject'],
                defaultValue: 'pending',
            },
            updatedBy: {
                type: DataTypes.STRING,
            },
        },
        { timestamps: true }
    );
    return AbsenceStatus;
};
