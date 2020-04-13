const ws = adonis.Ws().connect();
const form = document.querySelector('form');
const input = document.querySelector('input');
const messages = document.querySelector('#messages');
const joinedAs = document.querySelector('#joined-as');
const leaveButton = document.querySelector('#leave-button');
const totalUsers = document.getElementById('total-users');

ws.on('open', () => {
  const chat = ws.subscribe('chat');
  let usersSet;

  chat.on('chatMessage', (message) => {
    let li = document.createElement('li');
    li.textContent = message.body;
    messages.append(li);
  });

  chat.on('joined', ({ user }) => {
    joinedAs.textContent = user;
  });

  chat.on('joined', ({ users }) => {
    usersSet = new Set(users);
  });

  chat.on('joined', ({ users }) => {
    totalUsers.textContent = users.length;
  });

  chat.on('joined', ({ users }) => {
    let ul = document.createElement('ul');
    ul.id = 'joined-users';

    users.forEach((user) => {
      let li = document.createElement('li');
      li.textContent = user;
      ul.append(li);
    });

    let currentUl = document.querySelector('#joined-users');
    currentUl.replaceWith(ul);
  });

  chat.on('newUser', (user) => {
    usersSet.add(user);

    let li = document.createElement('li');
    li.textContent = user;
    document.querySelector('#joined-users').append(li);

    totalUsers.textContent = usersSet.size;
  });

  chat.on('userLeft', (user) => {
    usersSet.delete(user);

    let ul = document.createElement('ul');
    ul.id = 'joined-users';

    usersSet.forEach((user) => {
      let li = document.createElement('li');
      li.textContent = user;
      ul.append(li);
    });

    let currentUl = document.querySelector('#joined-users');
    currentUl.replaceWith(ul);

    totalUsers.textContent = usersSet.size;
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
