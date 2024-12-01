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
        messageElement.innerHTML = findAnswer(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 900);
    };

    const findAnswer = (question) => {
      let bestMatch = null;
      let bestScore = 0;

      for (const category in data) {
        const categoryData = data[category];
        let score = 0;

        for (const keyword of categoryData.keywords) {
          const regex = new RegExp(`\\b${keyword}\\b`, "gi"); // Word boundary matching
          const matches = question.match(regex);
          if (matches) {
            score += matches.length * (categoryData.weight || 1); // Add the number of matches
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = categoryData.answer;
        }
      }

      return (
        bestMatch ||
        "Sorry, I don't quite understand your question. Please try again or give us a phone call +61 0406 888 546."
      );
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

const serviceCards = document.getElementsByClassName("service-card");
const serviceDetail = document.querySelector(".service-detail");
const closeService = document.querySelector(".close-service");
const serviceCategories = serviceDetail.getElementsByClassName("category");

for (i = 0; i < serviceCards.length; i++) {
  let categoryIndex = i;
  let card = serviceCards[i];
  let overlay = card.lastElementChild;

  overlay.addEventListener("click", () => {
    document.body.classList.toggle("show-detail");
    document.body.classList.toggle("no-scroll");
    serviceCategories[categoryIndex].scrollIntoView();
  });
}

closeService.addEventListener("click", () => {
  document.body.classList.toggle("show-detail");
  document.body.classList.toggle("no-scroll");
});

$(".owl-carousel").owlCarousel({
  items: 1,
  loop: true,
  margin: 30,
  autoplay: true,
  autoplayTimeout: 3500,
  autoplayHoverPause: true,
  responsive: {
    992: {
      items: 2,
    },
    1400: {
      items: 3,
    },
  },
});

$(".scrollable").on("DOMMouseScroll mousewheel", function (ev) {
  var $this = $(this),
    scrollTop = this.scrollTop,
    scrollHeight = this.scrollHeight,
    height = $this.height(),
    delta =
      ev.type == "DOMMouseScroll"
        ? ev.originalEvent.detail * -40
        : ev.originalEvent.wheelDelta,
    up = delta > 0;

  var prevent = function () {
    ev.stopPropagation();
    ev.preventDefault();
    ev.returnValue = false;
    return false;
  };

  if (!up && -delta > scrollHeight - height - scrollTop) {
    // Scrolling down, but this will take us past the bottom.
    $this.scrollTop(scrollHeight);
    return prevent();
  } else if (up && delta > scrollTop) {
    // Scrolling up, but this will take us past the top.
    $this.scrollTop(0);
    return prevent();
  }
});
