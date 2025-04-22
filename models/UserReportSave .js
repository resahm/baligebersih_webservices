module.exports = (sequelize, DataTypes) => {
    const UserReportSave = sequelize.define(
      "UserReportSave",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "User",
            key: "id"
          },
          onDelete: "CASCADE"
        },
        report_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Report",
            key: "id"
          },
          onDelete: "CASCADE"
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        tableName: "t_user_report_save",
        timestamps: true
      }
    );
  
    UserReportSave.associate = (models) => {
      UserReportSave.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      UserReportSave.belongsTo(models.Report, { foreignKey: "report_id", as: "report" });
    };
  
    return UserReportSave;
  };
  