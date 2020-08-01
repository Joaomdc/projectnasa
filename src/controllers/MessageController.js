const Message = require('../models/Message');
const User = require('../models/User');

module.exports = {
    async information(req){
        const { description, user_id, group_id } = req;
        //Verificação para ver se o ID é existente, ao contrário volta erro
        const user = await User.findById(user_id);

        if (!user){
           console.log('User does not exists')
        }

        await Message.create({
            user: user_id,
            description,
            time: Date.now(),
            group: group_id
        })
    },

      // Listar mensagens
      async index(req, res){
        try{
            const message = await Message.find().limit(100).sort({_id:1});

            return res.json(message)
        } catch (err){
            return res.status(400).send( { error: 'Erro ao listar todos os usuários'} )
        } 
    },

};