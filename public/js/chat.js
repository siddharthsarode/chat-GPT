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
    div.className = "message " + (msg.role === "user" ? "user" : "ai");
    div.innerHTML = `<span>${msg.content}</span>`;
    messagesSection.appendChild(div);
  });
  messagesSection.scrollTop = messagesSection.scrollHeight;
}

messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  const chat = chats.find((c) => c.id === currentChatId);
  chat.messages.push({ role: "user", content: text });
  renderMessages();
  messageInput.value = "";

  socket.emit("message", text);
});

console.log("chats", chats);
// catching server ai message here
socket.on("ai-message-response", (message) => {
  const chat = chats.find((c) => c.id === currentChatId);
  chat.messages.push({ role: "ai", content: message });
  renderMessages();
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
