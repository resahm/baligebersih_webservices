module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        "Comment",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Post",
                    key: "id"
                },
                onDelete: "CASCADE"
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
            }
        },
        {
            tableName: "t_comment",
            timestamps: true
        }
    );

    Comment.associate = (models) => {
        Comment.belongsTo(models.Post, { foreignKey: "post_id", as: "post" });
        Comment.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    };

    return Comment;
};
