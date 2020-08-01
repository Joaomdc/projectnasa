/* App */
const express = require('express');     
const routes =  require('./routes');
const cors = require('cors');

const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://joao:joao@projectnasa-i6lea.mongodb.net/projectnasa?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3333);

/* Socket Chat */
const path = require('path');
const chat = express();
const server = require('http').createServer(chat);
const io = require('socket.io')(server);
const formatMessage = require('./chat/utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./chat/utils/users');
const MessageController = require('./controllers/MessageController');
const UserController = require('./controllers/UserController');
const GroupController = require('./controllers/GroupController');

// Ao acessar o endpoint localhost:3003 redireciona para a pasta chat 
chat.use(express.static(path.join(__dirname, 'chat')));

const botName = 'ShaWeMe Bot'

// Conectando no socket
io.on('connection', socket => {

    //Entrar na sala
    socket.on('joinRoom', ({ user_id, group_id }) => {

        const username    = UserController.nameUserById(user_id)
        const room        = GroupController.groupNameById(group_id)
        //const message     = 
        
        username.then(username => {  
            room.then(room => {
                
                const user = userJoin(socket.id, username, room, user_id, group_id);

                console.log(user)
        
                socket.join(user.group_id);
        
                // Boas vindas
                socket.emit('message', formatMessage(botName, 'Welcome to ShaWeMe Chat!'));
                // Notificação entrada
                socket.broadcast.to(user.group_id).emit('message', formatMessage(botName, `${user.username} has joined the chat`));    
            
                // Notiifica informações da sala
                io.to(user.group_id).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.group_id)
                });    

            });
        });

    });
   
    // Ao executar evendo no front emite mensagem
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        const description   = msg
        const user_id       = user.user_id
        const group_id      = user.group_id

        req = { description, user_id, group_id }
        MessageController.information(req)

        io.to(user.group_id).emit('message', formatMessage(user.username, msg));
    })

    //Notificação Disconectar
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.group_id).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        
            // Notiifica informações da sala
            io.to(user.group_id).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.group_id)
            }); 
        }
        
    });

})

server.listen(process.env.PORT || 3003);