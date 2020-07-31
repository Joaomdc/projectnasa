const User = require('../models/User');

module.exports = {
    async index(req, res){
        const users = await User.find();

        const serializedUsers = users.map((element)=>{
            return { 
                title: element.picture,
                img_url: `http://localhost:3333/uploads/${element.picture}`
            }
        });
        return res.json(serializedUsers);
    }
};