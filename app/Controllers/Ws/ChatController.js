'use strict'

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onChatMessage (message) {
    this.socket.broadcastToAll('chatMessage', message)
  }
}

module.exports = ChatController
