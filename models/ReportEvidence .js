// Sequelize Model: t_report_evidences
module.exports = (sequelize, DataTypes) => {
    const ReportEvidence = sequelize.define('ReportEvidence', {
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
        type: DataTypes.STRING,
        allowNull: false
      },
    }, {
      tableName: 't_report_evidences',
      timestamps: true
    });
  
    ReportEvidence.associate = (models) => {
      ReportEvidence.belongsTo(models.Report, { foreignKey: 'report_id', as: 'report' });
    };
  
    return ReportEvidence;
  };
  