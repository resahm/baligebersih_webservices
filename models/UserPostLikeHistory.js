module.exports = (sequelize, DataTypes) => {
  const UserPostLikeHistory = sequelize.define(
    'UserPostLikeHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 't_user',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 't_post',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 't_user_post_likes_history',
      timestamps: true,
    }
  );

  UserPostLikeHistory.associate = (models) => {
    UserPostLikeHistory.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    UserPostLikeHistory.belongsTo(models.Post, {
      foreignKey: 'post_id',
      as: 'post',
    });
  };

  return UserPostLikeHistory;
};
