'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('t_user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email_verified_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 // 0 => User, 1 => Admin, 2 => Manager
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rememberToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      blocked_until: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      auth_provider: {
        type: Sequelize.ENUM('manual', 'google'),
        allowNull: false,
        defaultValue: 'manual'
      },
      is_active:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fcm_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('t_user');
  }
};
