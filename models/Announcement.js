module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define(
        "Announcement",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            file: {
                type: DataTypes.STRING,
                allowNull: true // File opsional (bisa PDF atau gambar)
            }
        },
        {
            tableName: "t_announcement",
            timestamps: true
        }
    );

    Announcement.associate = (models) => {
        Announcement.belongsTo(models.User, {
          foreignKey: "user_id",
          as: "user"
        });
      };
    
    return Announcement;
};
