const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

module.exports = {

    // Listar todos os usuários
    async index(req, res){
        const user = await User.find();

        return res.json(user)
    },

    /**
     * Função para criação de usuário
     * @param {*usuario} req 
     * @param {*usuario} res 
     */
    async create(req, res){
        const { fullname, email, username, password, state, country, help} = req.body;
        const { filename } = req.file;

        //console.log(filename);

        //Se ele encontrar um usúario com este e=mail ele vai salvar no user 
        let user = await User.findOne( { email } );

        //Caso já exista um e-mail cadastrado ele irá responder status 400
        if(user){
            return res.status(400).send( { error: 'Usuário já existe'} )
        }

        //Verificação para ver se e-mail já está cadastrado, caso não foi irá entrar no if
        if(!user){
            user = await User.create({
                fullname, 
                email, 
                username, 
                password, 
                state, 
                country, 
                picture: filename, 
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

        //Verificação para ver se o e-mail já está cadastrado, se existir faz a atualização
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
    },

    //destroy
    async delete(req, res){

        const {id} = req.body

        let user = await User.deleteOne({ _id : id })

        return res.json(user)
    },

    //autenticação
    async authenticate(req, res){
        const { email, password } = req.body; 

        const user = await User.findOne( { email } ).select('+password');

        if (!user){
            return res.status(400).send( { error: 'Usuário não encontrado'});
        }

        //Comparando para ver se a senha que o usuário digitou é a mesma que a do banco de dados. Await por que é uma função assincrona
        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).send( { error: 'Senha Inválida'});
        }

        //Para não voltar a senha
        user.password = undefined;

        // TODO: Token para 1 dia
        const token = jwt.sign( { id: user._id }, authConfig.secret,  {
            expiresIn: 86400,
        });

        res.send( { user, token } );
        
    }

}; // teste