'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class t_parameter extends Model {
    static associate(models) {
      // 🔥 Relasi ke tabel User
      t_parameter.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  t_parameter.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    report_guidelines: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergency_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ambulance_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    police_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firefighter_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 't_parameter',
    tableName: 't_parameter',
    timestamps: true, // createdAt & updatedAt otomatis
  });

  return t_parameter;
};
