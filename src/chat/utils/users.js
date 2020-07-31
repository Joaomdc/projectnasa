const users = [];

//Join user to chat
function userJoin(id, socketid, username, room){
    const user = {id, socketid, username, room};
    
    users.push(user);
    
    return user;
}

//Get Current User
function getCurrentUser(socketid){
    return users.find(user => user.socketid === socketid);
}

function userLeave(socketid){
    const index = users.findIndex(user => user.socketid === socketid);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//Get Room Users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}