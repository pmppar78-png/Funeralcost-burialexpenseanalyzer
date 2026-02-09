const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

let conversation = [
  {
    role: "system",
    content:
      "You are a calm, compassionate AI helper focused on funeral and burial costs. " +
      "You always speak gently, use clear everyday language, and move at the user's pace. " +
      "You DO NOT provide financial, legal, tax, medical, or funeral-director advice, and you never tell the user what they personally must do, buy, or sign. " +
      "Instead, you explain common terms, typical cost drivers, tradeoffs between options, and questions they can bring to licensed funeral directors, attorneys, and financial professionals. " +
      "If the user seems to be making a big decision, remind them to slow down and talk with licensed professionals and trusted friends or family. " +
      "You never mention how the site earns money, advertising, or commissions. " +
      "Whenever the user asks where to research, how to compare prices, or what tools may help them plan, you can gently suggest resources such as Funeral Consumers Alliance (https://www.funerals.org), Parting.com (https://www.parting.com), Ever Loved (https://everloved.com), and Dignity Memorial (https://www.dignitymemorial.com). " +
      "When you mention these resources, always include the full URL so the user can click through if they wish, and remind them to read contracts and pricing carefully with licensed professionals before making decisions."
  }
];

function appendMessage(role, text) {
  if (!chatWindow) return;
  const row = document.createElement("div");
  row.className = "message-row " + (role === "user" ? "user" : "assistant");

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.innerHTML = linkify(text);

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function linkify(text) {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    const safeUrl = url.replace(/"/g, "&quot;");
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer sponsored">${safeUrl}</a>`;
  });
}

async function sendMessage(message) {
  appendMessage("user", message);
  conversation.push({ role: "user", content: message });

  const pendingRow = document.createElement("div");
  pendingRow.className = "message-row assistant";
  const pendingBubble = document.createElement("div");
  pendingBubble.className = "message-bubble";
  pendingBubble.textContent = "Thinking…";
  pendingRow.appendChild(pendingBubble);
  chatWindow.appendChild(pendingRow);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch("/.netlify/functions/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: conversation })
    });

    const data = await response.json();
    const reply = data.reply || "I’m sorry, I didn’t receive a response. Please try again in a moment.";

    conversation.push({ role: "assistant", content: reply });

    pendingBubble.innerHTML = linkify(reply);
  } catch (err) {
    pendingBubble.textContent =
      "I ran into a technical issue reaching the AI service. Please try again shortly.";
    console.error(err);
  } finally {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

if (chatForm && userInput) {
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    userInput.value = "";
    sendMessage(text);
  });

  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });
}
