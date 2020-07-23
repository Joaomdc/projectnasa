const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    username: String,
    password: String,
    state: String,
    country: String,
    picture: String,
    help: Boolean,
},  
    { timestamps: true } 
);

/** Função para criar hash da senha. Só irá salvar no banco depois de gerar o hash*/
UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

module.exports = mongoose.model('User', UserSchema);