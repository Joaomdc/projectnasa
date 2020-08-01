const users = [];

//Join user to chat
function userJoin(id, username, room, user_id, group_id){
    const user = {id, username, room, user_id, group_id};
    
    users.push(user);
    
    return user;
}

//Get Current User
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//Get Room Users
function getRoomUsers(group_id){
    return users.filter(user => user.group_id === group_id);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}