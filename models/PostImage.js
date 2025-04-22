module.exports = (sequelize, DataTypes) => {
    const PostImage = sequelize.define(
        "PostImage",
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
            image: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "t_post_image",
            timestamps: true,
            underscored: true
        }
    );

    PostImage.associate = (models) => {
        PostImage.belongsTo(models.Post, { foreignKey: "post_id", as: "post" });
    };

    return PostImage;
};
