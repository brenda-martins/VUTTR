const { Tool, sequelize } = require('../models');
const { Tag } = require('../models');

class ToolController {

    async index(req, res) {

        const { tags } = req.query;

        const tools = await Tool.findAll({
            include: {
                association: 'tags',
                attributes: ["name"],
                through: {
                    attributes: []
                }
            },
            attributes: ["title", "link", "description"]
        });

        // if (!tools.length > 0) {
        //     return res.status(204).send();
        // }

        const toolsMap = tools.map(tool => {
            const result = tool.toJSON();
            result.tags = result.tags.map(tag => tag.name);

            return result;
        });

        return res.status(200).json(toolsMap);
    }


    async store(req, res) {

        const { title, link, description, tags = [] } = req.body;

        const tool = await Tool.create({
            title,
            link,
            description
        });


        const newsTags = [];

        for (const tag of tags) {

            const [newTag] = await Tag.findOrCreate({ where: { name: tag } });


            await tool.addTags(newTag);

            await newsTags.push(newTag);
        }

        const newTool = {
            ...tool.get({
                plain: true,
            }),
            tags: newsTags,
        };

        return res.status(201).json(newTool);

    }


    async delete(req, res) {
        const tool_id = req.params;

        const tool = await Tool.findByPk(tool_id.id);

        if (!tool) {
            return res.status(400).json({ err: "Tool not Found" });
        }


        await tool.destroy();

        return res.status(204).send();
    }
}

module.exports = new ToolController();