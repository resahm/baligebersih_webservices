module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
        "Post",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "User",
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            total_likes: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_pinned: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        },
        {
            tableName: "t_post",
            timestamps: true,      
            underscored: true
        }
    );

    Post.associate = (models) => {
        Post.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        Post.hasMany(models.PostImage, { foreignKey: "post_id", as: "images" });
        Post.hasMany(models.Comment, { foreignKey: "post_id", as: "comments" });
        Post.hasMany(models.UserPostLikeHistory, { foreignKey: "post_id", as: "likesRelation" });
    };

    return Post;
};
