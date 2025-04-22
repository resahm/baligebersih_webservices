'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("t_post", {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          user_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: "t_user", // Sesuaikan dengan nama tabel user di database
                  key: "id"
              },
              onDelete: "CASCADE"
          },
          content: {
              type: Sequelize.TEXT,
              allowNull: false
          },
          total_likes: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 0
          },
          is_pinned: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
          created_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn("NOW")
          },
          updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn("NOW")
          }
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("t_post");
  }
};
