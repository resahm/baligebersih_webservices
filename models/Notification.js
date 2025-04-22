'use strict';

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('report', 'account', 'verification', 'general'),
        allowNull: false,
        defaultValue: 'general',
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sent_by: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'system',
      },
      role_target: {
        type: DataTypes.ENUM('user', 'admin', 'all'),
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      tableName: 't_notification',
      underscored: true,
      timestamps: true, // ✅ untuk createdAt dan updatedAt otomatis
    }
  );

  Notification.associate = function (models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Notification.belongsTo(models.Report, {
      foreignKey: 'report_id',
      as: 'report',
    });
  };

  return Notification;
};
