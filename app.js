// State
let state = {
  apiKey: localStorage.getItem('gemini_api_key') || '',
  model: localStorage.getItem('gemini_model') || 'gemini-2.0-flash',
  sessions: JSON.parse(localStorage.getItem('gemini_sessions') || '[]'),
  currentId: null,
  history: [],
  loading: false
};

// Init
const $ = id => document.getElementById(id);
const chatArea = $('chatArea');
const messagesEl = $('messages');
const welcomeEl = $('welcome');
const input = $('userInput');

function init() {
  $('apiKeyInput').value = state.apiKey;
  $('modelSelect').value = state.model;
  renderHistory();
  if (!state.apiKey) setTimeout(() => $('settingsModal').classList.add('open'), 500);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 160) + 'px';
  });
}

// Sessions
function newChat() {
  state.currentId = null;
  state.history = [];
  messagesEl.innerHTML = '';
  welcomeEl.style.display = 'flex';
  messagesEl.style.display = 'none';
  document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
}

function saveSession(title) {
  if (!state.currentId) {
    state.currentId = Date.now().toString();
    state.sessions.unshift({ id: state.currentId, title, history: state.history });
  } else {
    const s = state.sessions.find(s => s.id === state.currentId);
    if (s) s.history = state.history;
  }
  localStorage.setItem('gemini_sessions', JSON.stringify(state.sessions.slice(0, 30)));
  renderHistory();
}

function loadSession(id) {
  const s = state.sessions.find(s => s.id === id);
  if (!s) return;
  state.currentId = id;
  state.history = s.history;
  messagesEl.innerHTML = '';
  welcomeEl.style.display = 'none';
  messagesEl.style.display = 'flex';
  s.history.forEach(m => addBubble(m.role === 'user' ? 'user' : 'ai', m.parts[0].text, false));
  document.querySelectorAll('.history-item').forEach(el => el.classList.toggle('active', el.dataset.id === id));
}

function renderHistory() {
  $('chatHistory').innerHTML = state.sessions.map(s =>
    `<div class="history-item${s.id === state.currentId ? ' active' : ''}" data-id="${s.id}" onclick="loadSession('${s.id}')">${escHtml(s.title)}</div>`
  ).join('');
}

// Messaging
async function sendMessage() {
  const text = input.value.trim();
  if (!text || state.loading) return;
  if (!state.apiKey) { $('settingsModal').classList.add('open'); return; }

  welcomeEl.style.display = 'none';
  messagesEl.style.display = 'flex';
  input.value = '';
  input.style.height = 'auto';

  addBubble('user', text);
  state.history.push({ role: 'user', parts: [{ text }] });

  const typingId = addTyping();
  state.loading = true;
  $('sendBtn').disabled = true;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${state.model}:generateContent?key=${state.apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: state.history }) }
    );
    const data = await res.json();
    removeTyping(typingId);

    if (data.error) { addBubble('ai', `Xato: ${data.error.message}`); return; }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Javob kelmadi.';
    state.history.push({ role: 'model', parts: [{ text: reply }] });
    addBubble('ai', reply);
    saveSession(text.slice(0, 40));
  } catch (e) {
    removeTyping(typingId);
    addBubble('ai', 'Xato yuz berdi. Internet yoki API kalitini tekshiring.');
  } finally {
    state.loading = false;
    $('sendBtn').disabled = false;
  }
}

// DOM helpers
function addBubble(role, text, scroll = true) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  const time = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  const avatar = role === 'ai'
    ? `<div class="msg-avatar ai">G</div>`
    : `<div class="msg-avatar user-av">S</div>`;
  const html = role === 'ai' ? formatAI(text) : `<div class="msg-bubble">${escHtml(text)}</div>`;
  div.innerHTML = role === 'ai'
    ? `${avatar}<div class="msg-content">${html}<div class="msg-time">${time}</div></div>`
    : `<div class="msg-content">${html}<div class="msg-time" style="text-align:right">${time}</div></div>${avatar}`;
  messagesEl.appendChild(div);
  if (scroll) chatArea.scrollTop = chatArea.scrollHeight;
  return div;
}

function formatAI(text) {
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code class="${lang}">${escHtml(code.trim())}</code></pre>`);
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/\n/g, '<br>');
  return `<div class="msg-bubble">${text}</div>`;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let typingCounter = 0;
function addTyping() {
  const id = 'typing-' + (++typingCounter);
  const div = document.createElement('div');
  div.className = 'message ai'; div.id = id;
  div.innerHTML = `<div class="msg-avatar ai">G</div><div class="msg-content"><div class="msg-bubble" style="padding:0"><div class="typing-dot"><span></span><span></span><span></span></div></div></div>`;
  messagesEl.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  return id;
}
function removeTyping(id) { document.getElementById(id)?.remove(); }

function useSuggestion(btn) {
  input.value = btn.textContent;
  sendMessage();
}

// Settings
$('openSettings').onclick = () => $('settingsModal').classList.add('open');
$('closeSettings').onclick = () => $('settingsModal').classList.remove('open');
$('settingsModal').onclick = e => { if (e.target === $('settingsModal')) $('settingsModal').classList.remove('open'); };
$('saveSettings').onclick = () => {
  const key = $('apiKeyInput').value.trim();
  const model = $('modelSelect').value;
  if (!key) { showToast("API kalitini kiriting"); return; }
  state.apiKey = key; state.model = model;
  localStorage.setItem('gemini_api_key', key);
  localStorage.setItem('gemini_model', model);
  $('settingsModal').classList.remove('open');
  showToast("Saqlandi ✓");
};

// Sidebar
$('toggleSidebar').onclick = () => $('sidebar').classList.toggle('collapsed');
$('mobileToggle').onclick = () => $('sidebar').classList.toggle('mobile-open');
$('newChatBtn').onclick = newChat;

function showToast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2500);
}

init();
