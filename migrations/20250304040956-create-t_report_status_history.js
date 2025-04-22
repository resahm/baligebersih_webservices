'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('t_report_status_history', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 't_report',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      changed_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 't_user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      previous_status: {
        type: Sequelize.ENUM('pending', 'rejected', 'verified', 'in_progress', 'completed', 'closed'),
        allowNull: false
      },
      new_status: {
        type: Sequelize.ENUM('pending', 'rejected', 'verified', 'in_progress', 'completed', 'closed'),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('t_report_status_history');
  }
};
