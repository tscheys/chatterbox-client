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
      var room = $('#roomSelect').find(':selected').text();
      _.each(data.results, function(val) {
        app.addMessage(val);

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
  var user = window.location.search.slice(10);
  app.send({
    text: textMessage,
    username: user,
    roomname: 'lobby'
  });
});
//Chat room event handler
$('#roomSelect').change(function(evt) {
  console.log('test');
  app.fetch();
});


app.init();


 setInterval(function(){
   app.fetch();
 }, 2000);
 setInterval(function(){
   app.clearMessages();
 }, 10000);

});












