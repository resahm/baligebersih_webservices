'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('t_parameter', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 't_user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      terms: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      report_guidelines: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      emergency_contact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ambulance_contact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      police_contact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      firefighter_contact: {
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
    await queryInterface.dropTable('t_parameter');
  }
};
