
module.exports = (sequelize, DataTypes) => {

    const Tool = sequelize.define(
        "Tool",
        {
            title: DataTypes.STRING,
            link: DataTypes.STRING,
            description: DataTypes.STRING
        }
    );

    Tool.associate = function (models) {
        Tool.belongsToMany(models.Tag, { foreignKey: 'tool_id', through: 'tool_tags', as: 'tags' });
    }

    return Tool;
}
