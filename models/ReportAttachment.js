module.exports = (sequelize, DataTypes) => {
    const ReportAttachment = sequelize.define(
      'ReportAttachment',
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
        file: {
          type: DataTypes.STRING(255),
          allowNull: false
        }
      },
      {
        tableName: 't_report_attachment',
        timestamps: true
      }
    );
  
    ReportAttachment.associate = (models) => {
      ReportAttachment.belongsTo(models.Report, { foreignKey: 'report_id', as: 'report' });
    };
  
    return ReportAttachment;
  };
  