'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('t_notification', {
      id: {
        allowNull: false,
        autoIncrement: true, // atau pakai UUID jika prefer
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 't_user', // sesuaikan dengan nama tabel user-mu
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('report', 'account', 'verification', 'general'),
        allowNull: false,
        defaultValue: 'general',
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 't_report',
          key: 'id',
        }, 
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sent_by: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'system',
      },
      role_target: {
        type: Sequelize.ENUM('user', 'admin', 'all'),
        allowNull: false,
        defaultValue: 'user',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('t_notification');
  },
};
