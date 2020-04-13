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
    this.socket.user = user;
    this.socket.emit('joined', {
      user,
      users: Array.from(users)
    });
  }

  onUserLeft() {
    users.delete(this.socket.user);
  }
}

module.exports = ChatController
