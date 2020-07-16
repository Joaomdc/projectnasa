const User = require('../models/User');

module.exports = {

    // Listar todos os usuários
    async index(req, res){
        const user = await User.find();

        return res.json(user)
    },

    // Criação do cadastro
    async create(req, res){
        const { fullname, email, username, password, state, country, help} = req.body;
        const { picture } = req.file;

        //Se ele encontrar um usúario com este e=mail ele vai salvar no user 
        let user = await User.findOne({email});

        //Verificação para ver se e-mail já está cadastro, caso não foi irá entrar no if
        if(!user){
            user = await User.create({
                fullname, 
                email, 
                username, 
                password, 
                state, 
                country, 
                picture, 
                help
            });
        };

        return res.json(user);
    },

    // Atualização do cadastro
    async update(req, res){
        const { fullname, email, username, password, state, country, help} = req.body;
        const { picture } = req.file;

        //Se ele encontrar um usúario com este e=mail ele vai salvar no user 
        let user = await User.findOne({email});

        //Verificação para ver se e-mail já está cadastro se existir faz a atualização
        if(user){

            user = await User.update({
                fullname,
                email, 
                username, 
                password, 
                state, 
                country, 
                picture, 
                help
            });
        };

        return res.json(user);
    }
};