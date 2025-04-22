module.exports = (sequelize, DataTypes) => {
    const UserReportLikeHistory = sequelize.define(
      'UserReportLikeHistory',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 't_user',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        report_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 't_report',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: 't_user_report_likes_history',
        timestamps: true,
      }
    );
  
    UserReportLikeHistory.associate = (models) => {
      UserReportLikeHistory.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      UserReportLikeHistory.belongsTo(models.Report, { foreignKey: 'report_id', as: 'report' });
    };
  
    return UserReportLikeHistory;
  };
  