const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input img");
const chatBox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");

let userMessage;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("Li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<img src="images/cosmedlogo2.png" /><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector('p').textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const messageElement = incomingChatLi.querySelector("p");

  setTimeout(() => {
    messageElement.textContent = "This is a fake response";
  }, 900);
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 400);
};

chatToggler.addEventListener("click", () => document.body.classList.toggle('show-chatbot'));
closeBtn.addEventListener("click", () => document.body.classList.remove('show-chatbot'));
sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
    handleChat();
  }
});
