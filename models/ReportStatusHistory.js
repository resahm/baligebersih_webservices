module.exports = (sequelize, DataTypes) => {
    const ReportStatusHistory = sequelize.define(
      'ReportStatusHistory',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        report_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 't_report',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        changed_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'User',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        previous_status: {
          type: DataTypes.ENUM('pending', 'rejected', 'verified', 'in_progress', 'completed', 'closed'),
          allowNull: false
        },
        new_status: {
          type: DataTypes.ENUM('pending', 'rejected', 'verified', 'in_progress', 'completed', 'closed'),
          allowNull: false
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false
        }
      },
      {
        tableName: 't_report_status_history',
        timestamps: true
      }
    );
  
    ReportStatusHistory.associate = (models) => {
      ReportStatusHistory.belongsTo(models.Report, { foreignKey: 'report_id', as: 'report' });
      ReportStatusHistory.belongsTo(models.User, { foreignKey: 'changed_by', as: 'admin' });
    };
  
    return ReportStatusHistory;
  };
  