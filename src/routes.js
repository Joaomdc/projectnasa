const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const UserController = require('./controllers/UserController');
const HashtagController = require('./controllers/HashtagController');
const GroupController = require('./controllers/GroupController');
const MessageController = require('./controllers/MessageController');

const routes = express.Router();
const upload = multer(uploadConfig);

const authMiddleware = require('./middlewares/auth');

//hashtag
routes.post('/hashtag', HashtagController.create);
routes.get('/hashtag', HashtagController.index);

//user
routes.post('/users', upload.single('picture'), UserController.create);
routes.put('/users', authMiddleware ,upload.single('picture'), UserController.update);
routes.get('/users', authMiddleware , UserController.index);
routes.delete('/users', authMiddleware , UserController.delete);
routes.post('/authenticate', UserController.authenticate);

//Group
routes.post('/group', authMiddleware, upload.single('picture'), GroupController.create);
routes.get('/group', authMiddleware, GroupController.index);

//Message
routes.post('/message', authMiddleware, MessageController.information);

module.exports = routes;