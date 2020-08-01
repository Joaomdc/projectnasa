const Group = require('../models/Group');
const User = require('../models/User');
const Hashtag = require('../models/Hashtag');
const { hash } = require('bcryptjs');

module.exports = {
    async create(req, res){
        try{
            const { filename } = req.file;
            const { title, description, participants} = req.body;
            // Headers para enviar contexto de autenticação
            const { hashtag_id } = req.headers;
            
            const group = await Group.create({
                user: req.userId,
                picture: filename,
                title,
                description,
                hashtag: hashtag_id,
                participants
            })
            return res.json(group);
        } catch (err){
            return res.status(400).send( { error: 'Error creating the room, please try again'} )
        }
    },

    async update(req, res){
        try{
            const { filename } = req.file;
            const { title, description, participants} = req.body;
            // Headers para enviar contexto da alteração
            const { user_id } = req.headers;
            const { hashtag_id } = req.headers;

        //Verificação para pegar campo id do usúario e dar update
            const room = await Group.findByIdAndUpdate(req.params.groupId, { 
                picture: filename,
                title, 
                description,
                participants,
        }, { new: true });

        return res.json(room);

        } catch (err){
            return res.status(400).send( { error: 'Error updating room information'} )
        }
    },

    async index(req, res){
        try{
            const group = await Group.find().populate(['user', 'hashtag']);

            return res.json(group)
        } catch (err){
            return res.status(400).send( { error: 'Error listing all rooms'} )
        }

    },

    async indexByGroupId(req, res){
        try{
            const group = await Group.findById(req.params.groupId).populate(['user', 'hashtag']);

            return res.json(group)
        } catch (err){
            console.log(err);
            return res.status(400).send( { error: 'Error listing room by ID Group'} )
        }
    },

    async groupNameById(req, rom){
        try{
            const group = await Group.findById(req).populate(['user', 'hashtag']);

            return rom = group.title
        } catch (err){
            console.log(err);
        }
    },

    async delete(req, res){
        try{
            const group = await Group.findByIdAndRemove(req.params.groupId);

            return res.send();
        } catch (err){
            return res.status(400).send( { error: 'Error deleting the room, please try again later'} )
        }        
    },

    async indexByHashtagId(req, res){
        try{
            const { hash } = req.params;

            const byhash = await Group.find({ hashtag: hash }).populate(['user', 'hashtag']);

            return res.json(byhash);
        } catch (err){
            return res.status(400).send( { error: 'Error listing all rooms by ID Hashtag'} )
        }
    },

    async indexByUserId(req, res){
        try{
            const { user_id } = req.body;

            const byuserid = await Group.find({ user: user_id }).populate(['user', 'hashtag']);

            return res.json(byuserid);
        } catch (err){
            return res.status(400).send( { error: 'Error listing all rooms by User ID'} )
        }
    },
};