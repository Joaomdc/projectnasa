const Hashtag = require('../models/Hashtag');

module.exports = {
    async indexbyId(req, res){
        try{
            const hashtag = await Hashtag.findById(req.params.hashtagId);

            return res.json(hashtag)
        } catch (err){
            return res.status(400).send( { error: 'Error to list hashtags by ID'} )
        }
    },

    async create(req, res){
        try{    
            const { theme, description} = req.body;

            const hash = await Hashtag.create({
                theme, 
                description
            });

            return res.json(hash);
        } catch (err){
            return res.status(400).send( { error: 'Error to register the hashtags'} )
        }
    }, 

    async index(req, res){
        try{
            const hashtag = await Hashtag.find();

            return res.json(hashtag)
        } catch (err){
            return res.status(400).send( { error: 'Error to list hashtags'} )
        }
    },
    
    async delete(req, res){
        try{
            const hashtag = await Hashtag.findByIdAndRemove(req.params.hashtagId);

            return res.send();
        } catch (err){
            return res.status(400).send( { error: 'Error to delete Hashtag, please try again later'} )
        }        
    }
};