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

app.listen(3333);

/* Socket Chat */
const path = require('path');
const chat = express();
const server = require('http').createServer(chat);
const io = require('socket.io')(server);
const formatMessage = require('./chat/utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./chat/utils/users');
const MessageController = require('./controllers/MessageController');
const GroupController = require('./controllers/GroupController');

// Ao acessar o endpoint localhost:3003 redireciona para a pasta chat 
chat.use(express.static(path.join(__dirname, 'chat')));

const botName = 'ShaWeMe Bot'

// Conectando no socket
io.on('connection', socket => {

    //Entrar na sala
    socket.on('joinRoom', ({ id, username, room }) => {
        
        const user = userJoin(id, socket.id, username, room);

        socket.join(user.room);


        //const groupId = user.room
        //GroupController.indexByGroupId(groupId, group)

        //console.log(group)



        // Boas vindas
        socket.emit('message', formatMessage(botName, 'Welcome to ShaWeMe Chat!'));
        // Notificação entrada
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));    
    
        // Notiifica informações da sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });    
    });

   
    // Ao executar evendo no front emite mensagem
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));


       //MessageController.information({})
    })

    //Notificação Disconectar
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        
            // Notiifica informações da sala
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            }); 
        }
        
    });

})

server.listen(3003);