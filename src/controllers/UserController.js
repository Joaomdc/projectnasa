const User = require('../models/User');

module.exports = {

    // Criação do cadastro
    async create(req, res){
        const { fullname } = req.body;
        const { email } = req.body;
        const { username } = req.body;
        const { password } = req.body;
        const { state } = req.body;
        const { country } = req.body;
        const { picture } = req.file;
        const { help } = req.body;

        //Se ele encontrar um usúario com este e=mail ele vai salvar no user 
        let user = await User.findOne({email});

        //Verificação para ver se e-mail já está cadastro, caso não foi irá entrar no if
        if(!user){
            user = await User.create({fullname}, {email}, {username}, {password}, {state}, {country}, {picture}, {help});
        };

        return res.json(user);
    }
};