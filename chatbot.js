"use strict";

(function () {
  function initChatbot() {
    const chatLauncher = document.getElementById("lbChatLauncher");
    const chatWindow = document.getElementById("lbChatWindow");
    const chatClose = document.getElementById("lbChatClose");
    const chatBody = document.getElementById("lbChatBody");
    const chatForm = document.getElementById("lbChatForm");
    const chatInput = document.getElementById("lbChatInput");
    const sendButton = chatForm?.querySelector('button[type="submit"]');

    if (
      !chatLauncher ||
      !chatWindow ||
      !chatClose ||
      !chatBody ||
      !chatForm ||
      !chatInput ||
      !sendButton
    ) {
      console.error("Chatbot HTML IDs missing.");
      return;
    }

    if (chatForm.dataset.aiInitialized === "true") return;
    chatForm.dataset.aiInitialized = "true";

    const API_URL = "/api/chat";
    let busy = false;

    function scrollBottom() {
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addMessage(text, sender) {
      const div = document.createElement("div");
      div.className = "lb-message " + sender;
      div.style.whiteSpace = "pre-wrap";
      div.style.overflowWrap = "anywhere";
      div.textContent = text;

      chatBody.appendChild(div);
      scrollBottom();
      return div;
    }

    function addTyping() {
      const div = document.createElement("div");
      div.className = "lb-typing";
      div.setAttribute("role", "status");

      for (let i = 0; i < 3; i++) {
        div.appendChild(document.createElement("span"));
      }

      chatBody.appendChild(div);
      scrollBottom();
      return div;
    }

    function setBusy(value) {
      busy = value;
      chatInput.disabled = value;
      sendButton.disabled = value;
    }

    async function getAIReply(message) {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "AI service se connection nahi hua.");
      }

      if (!data?.reply) {
        throw new Error("AI se khaali response mila.");
      }

      return data.reply;
    }

    async function sendMessage(rawText) {
      if (busy) return;

      const message = String(rawText || "").trim();
      if (!message) return;

      addMessage(message, "user");
      setBusy(true);

      const typing = addTyping();

      try {
        const reply = await getAIReply(message);
        typing.remove();
        addMessage(reply, "bot");
      } catch (error) {
        typing.remove();
        addMessage(error.message, "bot");
      } finally {
        setBusy(false);
        chatInput.focus();
        scrollBottom();
      }
    }

    chatLauncher.addEventListener("click", () => {
      chatWindow.classList.toggle("open");
    });

    chatClose.addEventListener("click", () => {
      chatWindow.classList.remove("open");
    });

    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const message = chatInput.value.trim();
      if (!message || busy) return;

      chatInput.value = "";
      sendMessage(message);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot, { once: true });
  } else {
    initChatbot();
  }
})();