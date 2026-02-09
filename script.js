const chatContainer = document.getElementById("chatContainer");
const inputField = document.getElementById("userInput");

async function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return;

  // User message
  const userDiv = document.createElement("div");
  userDiv.className = "user-message";
  userDiv.textContent = message;
  chatContainer.appendChild(userDiv);

  inputField.value = "";

  // Bot typing
  const botDiv = document.createElement("div");
  botDiv.className = "bot-message";
  botDiv.textContent = "chanduAI is typing...";
  chatContainer.appendChild(botDiv);

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message   // 🔥 MUST MATCH backend
      })
    });

    const data = await response.json();

    botDiv.textContent =
      data.reply || "No response from AI";

  } catch (error) {
    botDiv.textContent = "⚠️ Error connecting to backend";
    console.error(error);
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

inputField.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});