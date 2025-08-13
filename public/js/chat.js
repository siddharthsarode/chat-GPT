// Chat UI logic
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const newChatBtn = document.getElementById("newChatBtn");
const chatList = document.getElementById("chatList");
const chatTitle = document.getElementById("chatTitle");
const messagesSection = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const headerToggleBtn = document.getElementById("header_toggle_btn");

let chats = [{ id: 1, title: "New chat", messages: [] }];
let currentChatId = 1;

function renderChatList() {
  chatList.innerHTML = "";
  chats.forEach((chat) => {
    const li = document.createElement("li");
    li.className =
      "chat-list-item" + (chat.id === currentChatId ? " active" : "");
    li.textContent = chat.title;
    li.onclick = () => selectChat(chat.id);
    chatList.appendChild(li);
  });
}

function selectChat(id) {
  currentChatId = id;
  const chat = chats.find((c) => c.id === id);
  chatTitle.textContent = chat.title;
  renderMessages();
  renderChatList();
}

function renderMessages() {
  const chat = chats.find((c) => c.id === currentChatId);
  messagesSection.innerHTML = "";
  chat.messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "message " + (msg.sender === "user" ? "user" : "bot");
    div.innerHTML = `<span>${msg.text}</span>`;
    messagesSection.appendChild(div);
  });
  messagesSection.scrollTop = messagesSection.scrollHeight;
}

messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  const chat = chats.find((c) => c.id === currentChatId);
  chat.messages.push({ sender: "user", text });
  renderMessages();
  messageInput.value = "";
  // Simulate bot response
  setTimeout(() => {
    chat.messages.push({ sender: "bot", text: `Echo: ${text}` });
    renderMessages();
  }, 600);
});

newChatBtn.addEventListener("click", function () {
  const newId = chats.length ? chats[chats.length - 1].id + 1 : 1;
  chats.push({ id: newId, title: `Chat ${newId}`, messages: [] });
  selectChat(newId);
});

toggleSidebarBtn.addEventListener("click", function () {
  sidebar.classList.toggle("collapsed");
});

headerToggleBtn.addEventListener("click", function () {
  sidebar.classList.toggle("collapsed");
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 900) {
    sidebar.classList.remove("collapsed");
  }
});

// Initial render
renderChatList();
renderMessages();
