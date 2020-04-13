const ws = adonis.Ws().connect();
const form = document.querySelector('form');
const input = document.querySelector('input');
const messages = document.querySelector('#messages');
const joinedAs = document.querySelector('#joined-as');
const leaveButton = document.querySelector('#leave-button');

ws.on('open', () => {
  const chat = ws.subscribe('chat');

  chat.on('chatMessage', (message) => {
    let li = document.createElement('li');
    li.textContent = message.body;
    messages.append(li);
  });

  chat.on('joined', ({ user }) => {
    joinedAs.textContent = user;
  });

  chat.emit('userJoined');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let message = input.value;
    input.value = '';

    if (message.trim() !== '') {
      ws.getSubscription('chat').emit('chatMessage', {
        body: message
      });
    }
  });

  leaveButton.addEventListener('click', function() {
    ws.getSubscription('chat').emit('userLeft');
    ws.close();
    this.disabled = true;
    // TODO: redirect to another page
  });

  window.addEventListener('beforeunload', () => {
    ws.getSubscription('chat').emit('userLeft');
    ws.close();
  });
});
