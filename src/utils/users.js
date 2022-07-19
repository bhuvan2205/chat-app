const users =[];

//Add user to the array
const addUser = ({ id, username, room })=> {

    //clean data 
    username = username.toLowerCase().trim();
    room = room.toLowerCase().trim();

    //validate data
    if(!username || !room){

        return {
            error: "Username and room are Required"
        }
    }

    //check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username
    });

    //Report existing name
    if(existingUser){
        return {
            error: "Username is in use"
        }
    }


    //Store User
    const user = { id, username, room } 
    users.push(user);
    return { user }
}


//Remove user

const removeUser = (id)=> {

    const index = users.findIndex(user=> user.id === id);

    if(index != -1){

        return users.splice(index, 1)[0];
    }
}

//Get user

const getUser = (id)=> {

    return users.find(user => user.id === id);
}

//Get users in a room

const getUsersInRoom = (room)=> {

    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room);
}


module.exports = { addUser, removeUser, getUser, getUsersInRoom};