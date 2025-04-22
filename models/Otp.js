'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class t_otp extends Model {
    static associate(models) {
      // Relasi ke User
      t_otp.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  t_otp.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'register', // bisa juga 'forgot'
    }
  }, {
    sequelize,
    modelName: 't_otp',
    tableName: 't_otp',
    timestamps: true,
  });

  return t_otp;
};
