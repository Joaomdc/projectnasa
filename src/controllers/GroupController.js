const Group = require('../models/Group');
const User = require('../models/User');

module.exports = {
    async create(req, res){
        const { filename } = req.file;
        const { title, description, participants} = req.body;
        // Headers para enviar contexto de autenticação
        const { user_id } = req.headers;
        const { hashtag_id } = req.headers;

        //Verificação para ver se o ID é existente, ao contrário volta erro
        const user = await User.findById(user_id);

        if (!user){
            return res.status(400).json({ error: 'User does not exists' });
        }

        const group = await Group.create({
            user: user_id,
            picture: filename,
            title,
            description,
            hashtag: hashtag_id,
            participants
        })

        return res.json(group);
    },

    async index(req, res){
        const group = {
            user: 2,
            picture: 'imagem.jpeg',
            title: 'so vem grupao',
            description: 'alou cajsiodjaio',
            hashtag: 1,
            participants: 2
        }
        return res.json(group);
    }
};