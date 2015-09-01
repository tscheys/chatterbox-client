// YOUR CODE HERE:

$(document).ready( function () {
var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';
app.rooms = {};

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
      console.log('chatterbox:' + data + ' received');
      var room = $('#roomSelect').find(':selected').text();
      console.log(data.results);
      _.each(data.results, function(val) {
        //if(room === val.roomname) {
          app.addMessage(val);
        //}
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

  $('#chats').append('<div>'+ '<a href="#" class="username">' + message.username + '</a>' +':' + message.text + '</div>');
}

app.addRoom = function (roomName) {
  roomName = app.escapeHTML(roomName);
  $('#roomSelect').append('<option value=' + roomName +'>'+ roomName+'</option>');
}

app.refreshRoom = function() {
  $('#roomSelect').empty();
  $('#roomSelect').append('<option id="newRoom">Add New Room...</option>')
  _.each(app.rooms, function(val) {
    app.addRoom(val);
  });
}

app.addFriend = function(userName) {
  console.log('here');
}
$('#chats').on('click', 'a.username', function(evt){
  //evt.preventDefault();
    console.log('here also');
  app.addFriend(this.text());

});

$('#main').on('click', '#send', function(evt){
  var textMessage = $('#message').val();
  var user = window.location.search.slice(10);
  app.send({
    text: textMessage,
    username: user,
    roomname: 'lobby'
  });
});

$('#roomSelect').change(function(evt) {
  console.log('test');
  app.fetch();
});


app.init();


 setInterval(function(){
   app.fetch();
 }, 2000);
 // setInterval(function(){
 //   app.clearMessages();
 // }, 10000);

});












