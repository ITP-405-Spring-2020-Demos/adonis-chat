const ws = adonis.Ws().connect();
const form = document.querySelector('form');
const input = document.querySelector('input');
const messages = document.querySelector('#messages');

ws.on('open', () => {
  const chat = ws.subscribe('chat');

  chat.on('chatMessage', (message) => {
    let li = document.createElement('li');
    li.textContent = message.body;
    messages.append(li);
  });

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
});
