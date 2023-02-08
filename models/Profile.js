module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
        avatar: {
            type: DataTypes.STRING,
        },
    });
    return Profile;
};
