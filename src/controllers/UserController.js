const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

const authConfig = require('../config/auth');

//Função de envio de e-mail para confirmação de conta
async function submit_account_token(user){        
    try{
        const token = crypto.randomBytes(20).toString('hex');

        await User.findByIdAndUpdate( user._id, {
            '$set': {
                accountToken: token,
            }
        });

        mailer.sendMail({
            to: user.email,
            from: 'visitantesilvapc@gmail.com',
            template: './submit_account',
            context: { token, id: user._id},
            subject: "Shawime: Token account verification"
        }, (err) => {
            if (err){
                return res.status(400).send( { error: 'It was not possible to send the e-mail, please try again'})
            }
            return res.status(201).send("E-mail successfully sent");
        });
        

    } catch (err){
        res.status(400).send( { error: 'Error registering the account, please try again' } )
    }
};

//Função de envio de e-mail para confirmação de conta por código de número (6 aleatórios)
async function submit_account_code(user){        
    try{
        const code = Math.floor(100000 + Math.random() * 900000);

        await User.findByIdAndUpdate( user._id, {
            '$set': {
                confirmation_code: code,
            }
        });

        mailer.sendMail({
            to: user.email,
            from: 'visitantesilvapc@gmail.com',
            template: './submit_account_code',
            context: { code },
            subject: "Shawime: Account verification with code",
        }, (err) => {
            if (err){
                return res.status(400).send( { error: 'It was not possible to send the e-mail with code, please try again'})
            }
            return res.status(201).send("E-mail successfully sent");
        });
        

    } catch (err){
        res.status(400).send( { error: 'Error registering the account, please try again' } )
    }
};

module.exports = {

    // Listar todos os usuários
    async index(req, res){
        try{
            const user = await User.find();

            return res.json(user)
        } catch (err){
            return res.status(400).send( { error: 'Error listing all users'} )
        } 
    },

    // Listar o usúario por ID
    async indexID(req, res){
        try{
            const user = await User.findById(req.body); 
    
            return res.send({user});
        }catch (err){
            return res.status(400).send({ error: 'Error listing all users by ID'});
        } 
    },

    // Busca nome do usuário
    async nameUserById(req, res){
        try{
            const user = await User.findById(req);
    
            return res = user.username;
        }catch (err){
            console.log("Erro ao Buscar nome do usuário")
        }
        
    },

    /**
     * Função para criação de usuário
     * @param {*usuario} req 
     * @param {*usuario} res 
     */
    async create(req, res){
        try{
            const { fullname, email, username, password, state, country, help, acceptTerm} = req.body;

            if(!req.file){
                return res.status(400).send( { error: 'Image upload is required', imageRequire: true} )
            }

            const { filename } = req.file;

            if(filename.includes(' ')){
                return res.status(400).send( { error: 'Invalid image, please remove spaces for name', imageRequire: true} )
            }

            //Se ele encontrar um usúario com este e=mail ele vai salvar no user 
            let user = await User.findOne( { email } );

            //Caso já exista um e-mail cadastrado ele irá responder status 400
            if(user){
                return res.status(400).send( { error: 'User already exists'} )
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
                    help,
                    acceptTerm
                });
        };

        submit_account_token(user);

        return res.json(user);

        } catch (err){
            return res.status(400).send( { error: 'Error creating user'} )
        }         
    },

    /**
     * Função para criação de usuário
     * @param {*usuario} req 
     * @param {*usuario} res 
     */
    async createV2(req, res){
        try{
            const { fullname, email, username, password, state, country, help, acceptTerm} = req.body;

            if(!req.file){
                return res.status(400).send( { error: 'Image upload is required', imageRequire: true} )
            }

            const { filename } = req.file;

            if(filename.includes(' ')){
                return res.status(400).send( { error: 'Invalid image, please remove spaces for name', imageRequire: true} )
            }

            //Se ele encontrar um usúario com este e=mail ele vai salvar no user 
            let user = await User.findOne( { email } );

            //Caso já exista um e-mail cadastrado ele irá responder status 400
            if(user){
                return res.status(400).send( { error: 'User already exists'} )
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
                    help,
                    acceptTerm
                });
        };

        submit_account_code(user);

        return res.json(user);

        } catch (err){
            console.log(err);
            return res.status(400).send( { error: 'Error creating user'} )
        }         
    },    

    //Função para atualizar o statusAccount (Confirmação por e-mail), enviando um Token
    async update_statusAccount_token(req, res){
        const { user_id, token } = req.body;

        try{
            const user = await User.findById( { _id: user_id }).select('+accountToken');

            if(!user){
                return res.status(400).send( { error: 'User not found' } )
            }

            if (token !== user.accountToken){
                return res.status(400).send( { error: 'Invalid Token' } )
            }

            user.statusAccount = 1;

            await user.save();

            res.send();

        } catch (err){
            res.status(400).send( { error: "Its not possible confirm your account, please try again later"} )
        }

    },    

    //Função para atualizar o statusAccount (Confirmação por e-mail), enviando um código de 6 digitos
    async update_statusAccount_code(req, res){
        const { user_id, codigo } = req.body;

        try{
            const user = await User.findById({ _id: user_id});

            if(!user){
                return res.status(400).send( { error: 'User not found' } )
            }

            if (codigo !== user.confirmation_code){
                return res.status(400).send( { error: 'Invalid code' } )
            }
            
            user.statusAccount = 1;

            await user.save();

            res.send();

        } catch (err){
            console.log(err);
            res.status(400).send( { error: "Its not possible confirm your account, please try again later"} )
        }

    },

    // Atualização do cadastro
    async update(req, res){
        try{
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
        }catch (err){
            return res.status(400).send({ error: 'Error updating user data'});
        }    
    },

    //destroy
    async delete(req, res){
        try{
            const {id} = req.body

            let user = await User.deleteOne({ _id : id })
    
            return res.json(user)
        } catch (err){
            return res.status(400).send( { error: 'Error deleting user'} )
        }
    },

    //autenticação
    async authenticate(req, res){
        const { email, password } = req.body; 

        const user = await User.findOne({ email }).select('+password');

        if (!user){
            return res.status(400).send( { error: 'User not found'});
        }

        if (user.statusAccount == 2){
            return res.status(400).send( { error: 'User not confirmed, please check your e-mail', userStatusBlock: true, _id: user._id });
        }

        //Comparando para ver se a senha que o usuário digitou é a mesma que a do banco de dados. Await por que é uma função assincrona
        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).send( { error: 'invalid password'});
        }

        //Para não voltar a senha
        user.password = undefined;

        // TODO: Token para 1 dia
        const token = jwt.sign( { id: user._id }, authConfig.secret,  {
            expiresIn: 86400,
        });

        res.send( { user, token } );
        
    },

    /**
     * Função de envio de e-mail de esqueci senha
     * @param {*usuario} req 
     * @param {*usuario} res 
     */
    async forgot_password(req, res){
        const { email } = req.body;

        try{
            const user = await User.findOne( { email });

            if(!user){
                return res.status(400).send( { error: 'User not found' } )
            }

            const token = crypto.randomBytes(20).toString('hex');
            
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate( user._id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });

            mailer.sendMail({
                to: email,
                from: 'visitantesilvapc@gmail.com',
                template: './forgot_password',
                context: { token },
                subject: "Shawime: Token for password change",
            }, (err) => {
                if (err){
                    return res.status(400).send( { error: 'It was not possible to send the e-mail forgot password, please try again'})
                }

                return res.status(201).send("E-mail successfully sent");
            });

        } catch (err){
            res.status(400).send( { error: 'Error in forgot password, please try again' } )
        }
    },

    /**
     * Função para resetar a senha
     * @param {*usuario} req 
     * @param {*usuario} res 
     */
    async reset_password(req, res){
        const { email, token, password } = req.body;

        try{
            const user = await User.findOne( { email }).select('+passwordResetToken passwordResetExpires');

            if(!user){
                return res.status(400).send( { error: 'User not found' } )
            }

            if (token !== user.passwordResetToken){
                return res.status(400).send( { error: 'Invalid Token' } )
            }

            const now = new Date();

            if (now > user.passwordResetExpires){
                return res.status(400).send( { error: 'Expired Token, try again' } )
            }

            user.password = password;

            await user.save();

            res.send();

        } catch (err){
            res.status(400).send( { error: "It was not possible change password, please try again later"} )
        }

    },

    //Função para enviar uma nova senha para o usuário (sem token)
    async newPassword(req, res){
        const { email } = req.body;

        const newPass = Math.random().toString(36).substring(0, 11);

        try{
            const user = await User.findOne( { email });

            if(!user){
                return res.status(400).send( { error: 'User not found' } )
            }

            user.password = newPass;

            await user.save();
        
            mailer.sendMail({
                to: email,
                from: 'visitantesilvapc@gmail.com',
                template: './new_password',
                context: { newPass },
                subject: "Shawime: New Password request",
            }, (err) => {
                if (err){
                    return res.status(400).send( { error: 'It was not possible send the new password, please try again'})
                }

                return res.status(201).send("Email Successfully sent");
            });
            
            res.send();

        } catch (err){
            console.log(err);
            res.status(400).send( { error: 'Error in forgot password, please try again later' } )
        }
    }


}; 