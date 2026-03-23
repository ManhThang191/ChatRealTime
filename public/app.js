const socket = io();

let currentUser = '';
let typingTimer = null;
let isTyping = false;
const TYPING_TIMEOUT = 1500;

// DOM elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesEl = document.getElementById('messages');
const userListEl = document.getElementById('user-list');
const onlineCount = document.getElementById('online-count');
const typingIndicator = document.getElementById('typing-indicator');
const headerOnline = document.getElementById('header-online');
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

// ----- Login -----
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (!username) return;
  currentUser = username;
  socket.emit('user joined', username);
  loginScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  messageInput.focus();
});

// ----- Sidebar toggle (mobile) -----
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (
    sidebar.classList.contains('open') &&
    !sidebar.contains(e.target) &&
    !sidebarToggle.contains(e.target)
  ) {
    sidebar.classList.remove('open');
  }
});

// ----- Send message -----
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  socket.emit('chat message', { message });
  messageInput.value = '';
  stopTyping();
});

// ----- Typing indicators -----
messageInput.addEventListener('input', () => {
  if (!isTyping) {
    isTyping = true;
    socket.emit('typing', true);
  }
  clearTimeout(typingTimer);
  typingTimer = setTimeout(stopTyping, TYPING_TIMEOUT);
});

function stopTyping() {
  if (isTyping) {
    isTyping = false;
    socket.emit('typing', false);
  }
  clearTimeout(typingTimer);
}

// ----- Socket events -----
socket.on('chat message', ({ username, message, timestamp }) => {
  appendMessage(username, message, timestamp);
});

socket.on('user joined', (username) => {
  appendSystem(`${username} joined the chat`);
});

socket.on('user left', (username) => {
  appendSystem(`${username} left the chat`);
});

socket.on('user list', (users) => {
  userListEl.innerHTML = '';
  onlineCount.textContent = users.length;
  headerOnline.textContent = `${users.length} online`;
  users.forEach((u) => {
    const li = document.createElement('li');
    li.textContent = u;
    if (u === currentUser) li.classList.add('is-me');
    userListEl.appendChild(li);
  });
});

const typingUsers = {};

socket.on('typing', ({ username, isTyping: typing }) => {
  if (typing) {
    typingUsers[username] = true;
  } else {
    delete typingUsers[username];
  }
  updateTypingIndicator();
});

function updateTypingIndicator() {
  const names = Object.keys(typingUsers);
  if (names.length === 0) {
    typingIndicator.textContent = '';
    typingIndicator.classList.add('hidden');
  } else if (names.length === 1) {
    typingIndicator.textContent = `${names[0]} is typing…`;
    typingIndicator.classList.remove('hidden');
  } else {
    typingIndicator.textContent = `${names.join(', ')} are typing…`;
    typingIndicator.classList.remove('hidden');
  }
}

// ----- Helpers -----
function getInitials(name) {
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
    '#1abc9c', '#3498db', '#9b59b6', '#e91e63',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function appendMessage(username, message, timestamp) {
  const isOwn = username === currentUser;
  const row = document.createElement('div');
  row.className = 'msg-row' + (isOwn ? ' own' : '');

  const color = getAvatarColor(username);
  const safe = escapeHtml(message);
  const time = formatTime(timestamp);

  row.innerHTML = `
    <div class="msg-avatar" style="background:${color}">${getInitials(username)}</div>
    <div class="msg-bubble-wrap">
      ${!isOwn ? `<div class="msg-username">${escapeHtml(username)}</div>` : ''}
      <div class="msg-bubble">${safe}</div>
      <div class="msg-time">${time}</div>
    </div>
  `;

  messagesEl.appendChild(row);
  scrollToBottom();
}

function appendSystem(text) {
  const div = document.createElement('div');
  div.className = 'msg-system';
  div.textContent = text;
  messagesEl.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
