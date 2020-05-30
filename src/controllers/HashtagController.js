const Hashtag = require('../models/Hashtag');

module.exports = {
    async index(req, res){
        const { themes } = req.query;

        const hashtag = await Hashtag.find({ theme: themes })

        return res.json(hashtag);
    },

    async create(req, res){
        const { theme } = req.body;
        const { description } = req.body;

        const hash = await Hashtag.create({theme}, {description});

        return res.json(hash);
    }

};