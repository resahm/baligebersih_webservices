module.exports = (sequelize, DataTypes) => {
    const MediaCarousel = sequelize.define(
        "MediaCarousel",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: { // ✅ Tambahkan deskripsi
                type: DataTypes.TEXT,
                allowNull: true // Boleh kosong
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "t_media_carousels",
            timestamps: true
        }
    );

    MediaCarousel.associate = (models) => {
        MediaCarousel.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return MediaCarousel;
};
