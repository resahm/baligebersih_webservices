  'use strict';
  const { Model } = require('sequelize');

  module.exports = (sequelize, DataTypes) => {
    class User extends Model {
      static associate(models) {

      }
    }

    User.init({
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      phone_number: {
          type: DataTypes.STRING,
          allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      blocked_until: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null // **User tidak diblokir secara default**
      },
      auth_provider:{
        type: DataTypes.ENUM('manual', 'google'),
        allowNull: false,
        defaultValue: 'manual'
      },
      profile_picture:{
        type: DataTypes.STRING,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },    
      fcm_token:{
        type: DataTypes.STRING,
        allowNull: true
      },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 't_user', // **Pastikan sesuai dengan nama tabel di database**
      timestamps: true
    });

    return User;
  };
