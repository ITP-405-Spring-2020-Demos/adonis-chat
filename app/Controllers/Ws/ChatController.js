'use strict'

let users = new Set();

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onChatMessage (message) {
    this.socket.broadcastToAll('chatMessage', message)
  }

  onUserJoined() {
    let user = `Anonymous ${users.size}`;
    users.add(user);
    this.socket.emit('joined', {
      user
    });
  }
}

module.exports = ChatController
