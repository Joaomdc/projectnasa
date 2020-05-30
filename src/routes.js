const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const UserController = require('./controllers/UserController');
const HashtagController = require('./controllers/HashtagController');
const GroupController = require('./controllers/GroupController');
const MessageController = require('./controllers/MessageController');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/hashtag', HashtagController.create);
routes.get('/hashtag', HashtagController.index);
routes.post('/users', upload.single('picture') ,UserController.create);
routes.post('/group', upload.single('picture'),GroupController.create);
routes.post('/message', MessageController.information);

module.exports = routes;