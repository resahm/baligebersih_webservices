'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('t_report', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER, // Sesuai dengan tipe di t_user
        allowNull: false,
        defaultValue: 0, // ✅ Pastikan tidak NULL
        references: {
          model: 't_user', // Harus sesuai dengan nama tabel di database (perhatikan case-sensitive)
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      report_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'rejected', 'verified', 'in_progress', 'completed', 'closed', 'cancelled'),
        allowNull: false, // ✅ Pastikan tidak NULL
        defaultValue: 'pending'
      },
      total_likes: {
        type: Sequelize.INTEGER,
        allowNull: false, // ✅ Pastikan tidak NULL
        defaultValue: 0  // ✅ Default agar tidak NULL
      },
      village: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: "" // ✅ Ganti dari NULL ke string kosong
      },
      location_details: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: "" // ✅ Ganti dari NULL ke string kosong
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
        defaultValue: 0.0 // ✅ Pastikan tidak NULL
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
        defaultValue: 0.0 // ✅ Pastikan tidak NULL
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // ✅ Set default waktu dibuat
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') // ✅ Pastikan updatedAt diperbarui otomatis
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('t_report');
  }
};
