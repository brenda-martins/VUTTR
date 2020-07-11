
module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        name: DataTypes.STRING
    }, { timestamps: false });

    Tag.associate = function (models) {

        Tag.belongsToMany(models.Tool, { foreignKey: 'tag_id', through: 'tool_tags', as: 'tools' });
    }

    return Tag;
}