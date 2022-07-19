const socket = io();

//Grab the UI Elements
const $form = document.querySelector('#msg_form');
const $formInput = document.querySelector('input');
const $formBtn = document.querySelector('#send_btn');
const $locationBtn = document.querySelector('#location_btn');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const LocationmessageTemplate = document.querySelector('#location_message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Query string
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll= ()=> {

    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMarginHeigt = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMarginHeigt;

    //Visible height
    const visibleHeight = $messages.offsetHeight;

    //Height of the message container
    const containerHeight = $messages.scrollHeight;

    //Scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight  <= scrollOffset){

        $messages.scrollTop = $messages.scrollHeight;
    }
}

//Messages
socket.on('message', (message) => {

    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:m A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

//Location message
socket.on('locationMessage', (message)=> {

    console.log(message);
    const html = Mustache.render(LocationmessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:m A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});


//Room Data

socket.on('roomData', ({ room, users })=> {

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });

    document.querySelector('#sidebar').innerHTML = html;
});

//Sending messages

$form.addEventListener('submit', (e) => {

    e.preventDefault();

    //Disable the Button
    const text = $formInput.value.trim();

    if(!text){
        return alert("Type Something!");
    }

    $formBtn.setAttribute('disabled', 'disabled');

    socket.emit('sendMessage', text, (error) => {

        //Disable the Button and claer the Input field
        $formBtn.removeAttribute('disabled');
        $formInput.value = "";
        //Move the cursor to the Input
        $formInput.focus();


        if (error) {
            return console.log(error);
        }

    });
});


// Location sharing
$locationBtn.addEventListener('click', () => {

    if (!navigator.geolocation) {

        return alert('Geolocation is not supported in your Browser')
    }

    $locationBtn.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
        },
            () => {
                $locationBtn.removeAttribute('disabled');
                console.log("Location shared");
            })
    })
});


//Join to the chat
socket.emit('join', { username, room }, (error)=> {

    if(error){

        alert(error);
        location.href= '/';
    }
});

//Mobile Responsive

const roomDiv = document.querySelector('.chat-details');
roomDiv.addEventListener('click', ()=> {

    console.log('btn click')

    const element = document.querySelector('#sidebar');
    console.log(element.classList);

    if(element.classList.contains('mobile-view')){

        element.className="chat__sidebar";
        roomDiv.innerHTML = "Room?";
    }
    else{

        element.className="chat__sidebar mobile-view";
        roomDiv.innerHTML = "Chat?";
    }
});