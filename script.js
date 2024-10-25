const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input img");
const chatBox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");

fetch("./answers.json")
  .then((res) => res.json())
  .then((data) => {
    let userMessage;

    const createChatLi = (message, className) => {
      const chatLi = document.createElement("Li");
      chatLi.classList.add("chat", className);
      let chatContent =
        className === "outgoing"
          ? `<p></p>`
          : `<img src="images/cosmedlogo2.png" /><p></p>`;
      chatLi.innerHTML = chatContent;
      chatLi.querySelector("p").textContent = message;
      return chatLi;
    };

    const generateResponse = (incomingChatLi, userMessage) => {
      const messageElement = incomingChatLi.querySelector("p");

      setTimeout(() => {
        messageElement.textContent = findAnswer(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 900);
    };

    const findAnswer = (question) => {
      let bestMatch = null;
      let bestScore = 0;

      for (const category in data) {
        const keywords = data[category].keywords;
        let score = 0;

        for (const keyword of keywords) {
          const regex = new RegExp(`\\b${keyword}\\b`, "gi"); // Word boundary matching
          const matches = question.match(regex);
          if (matches) {
            score += matches.length; // Add the number of matches
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = data[category].answer;
        }
      }

      return bestMatch || "I don't understand your question. Please try again.";
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
        generateResponse(incomingChatLi, userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 400);
    };

    chatToggler.addEventListener("click", () =>
      document.body.classList.toggle("show-chatbot")
    );
    closeBtn.addEventListener("click", () =>
      document.body.classList.remove("show-chatbot")
    );
    sendChatBtn.addEventListener("click", handleChat);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key == "Enter") {
        e.preventDefault();
        handleChat();
      }
    });
  });

$(".owl-carousel").owlCarousel({
  loop: true,
  margin: 30,
  autoplay: true,
  autoplayTimeout: 3500,
  autoplayHoverPause:true,
  responsive: {
    600: {
      items: 3,
    },
  },
});
