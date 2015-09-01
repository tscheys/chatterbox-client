// YOUR CODE HERE:

$(document).ready( function () {
var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';
app.rooms = {};
app.friendList = [];

app.init = function(){
  this.fetch();
};


app.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

}

app.fetch = function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      app.room = $('#roomSelect').find(':selected').text();
      _.each(data.results, function(val) {
        if(app.room === val.roomname){
          app.addMessage(val);
        }
        app.rooms[val.roomname] = val.roomname;
      });
      app.refreshRoom();
      
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message');
    }
  });

}

app.escapeHTML = function(message){
  if(message === undefined || message === null) {
    return;
  }
  return message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

app.clearMessages = function(){
  $('#chats').empty();
}

app.addMessage = function (message){
  message.username = app.escapeHTML(message.username);
  message.text = app.escapeHTML(message.text);
  var node = $('<div class="chat"><a href="#" class="username">' + message.username + '</a>' +':' + message.text + '</div>');
  if (_.contains(app.friendList, message.username)){

    node.addClass('friend');
  }

  $('#chats').append(node);
}

app.addRoom = function (roomName) {
  roomName = app.escapeHTML(roomName);
  // if(roomName === 'lobby') {
  //   $('#roomSelect').append('<option value=' + roomName +'selected="selected">'+ roomName+'</option>');

  // } else {
  $('#roomSelect').append('<option value=' + roomName +'>'+ roomName+'</option>');

}

app.refreshRoom = function() {
  $('#roomSelect').empty();
  _.each(app.rooms, function(val) {
    app.addRoom(val);
  });

  $('#roomSelect').append('<option>Add New Room...</option>')
  $('#roomSelect').val(app.room);
}

app.addFriend = function(userName) {
  app.friendList.push(userName);
}
//Username click event handler
$('#chats').on('click', 'a.username', function(evt){

  var name = this.innerText;
  app.addFriend(name);

});
//Send message event handler
$('#main').on('click', '#send', function(evt){
  var textMessage = $('#message').val();
  app.user = window.location.search.slice(10);
  app.send({
    text: textMessage,
    username: app.user,
    roomname: app.room
  });
});
//Chat room event handler
$('#roomSelect').change(function(evt) {
  if(this.value === 'Add New Room...'){
    var newRoom = prompt('Please Enter a Room Name');
    newRoom = app.escapeHTML(newRoom);
    app.send({
      text: 'Welcome to ' + newRoom,
      username: 'Chat Moderator',
      roomname: newRoom
    });
    app.addRoom(newRoom);
    $('#roomSelect').val(newRoom);
  }
  app.clearMessages();
  app.fetch();
});


app.init();


 setInterval(function(){
   app.fetch();
 }, 5000);
 setInterval(function(){
   app.clearMessages();
 }, 6000);

});












