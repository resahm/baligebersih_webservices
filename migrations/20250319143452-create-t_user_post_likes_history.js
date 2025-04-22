'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('t_user_post_likes_history', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 't_user',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 't_post',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // ✅ User hanya bisa like 1 post sekali
    await queryInterface.addConstraint('t_user_post_likes_history', {
      fields: ['user_id', 'post_id'],
      type: 'unique',
      name: 'unique_user_post_like_history',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('t_user_post_likes_history');
  }
};
