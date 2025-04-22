'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("t_media_carousels", {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 't_user', // pastikan ini nama tabel user kamu
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          title: {
              type: Sequelize.STRING,
              allowNull: true
          },
          description: { // ✅ Tambahkan deskripsi
              type: Sequelize.TEXT,
              allowNull: true // Boleh kosong
          },
          image: {
              type: Sequelize.STRING,
              allowNull: false
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn("NOW")
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn("NOW")
          }
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("t_media_carousels");
  }
};
