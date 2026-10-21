/* ============================================================
   Chat Frontend — AI Funeral Cost Expert
   Handles conversation, typing indicator, linkify, and UI
   ============================================================ */

var chatWindow = document.getElementById("chatWindow");
var chatForm = document.getElementById("chatForm");
var userInput = document.getElementById("userInput");
var chatSendBtn = document.getElementById("chatSendBtn");

/* The system prompt now lives server-side in
   netlify/functions/chat-config.mjs. Only user/assistant turns are kept here. */
var conversation = [];

var DISCLOSURE_HTML =
  '<p class="chat-disclosure" style="font-size:.8rem;color:#666;margin-top:.5rem;border-top:1px solid #eee;padding-top:.4rem">Some links above are affiliate links, so the site may earn a commission at no extra cost to you. ' +
  '<a href="/affiliate-disclosure.html">Read our disclosure</a></p>';

/* Maximum conversation messages to send (excluding system prompt) */
var MAX_FRONTEND_MESSAGES = 20;

/* ----------------------------------------------------------
   Linkify — handles plain URLs and markdown-style [text](url)
   ---------------------------------------------------------- */

function linkify(text) {
  if (!text) return "";

  // First, escape HTML to prevent XSS
  var escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Handle markdown-style links: [text](url)
  escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (match, linkText, url) {
    var safeUrl = url.replace(/"/g, "&quot;");
    return '<a href="' + safeUrl + '" target="_blank" rel="sponsored nofollow noopener noreferrer">' + linkText + '</a>';
  });

  // Handle markdown bold: **text**
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Handle remaining plain URLs (not already in an href)
  escaped = escaped.replace(/(^|[^"=])(https?:\/\/[^\s<]+)/g, function (match, prefix, url) {
    var safeUrl = url.replace(/"/g, "&quot;");
    // Clean trailing punctuation that's likely not part of the URL
    var cleanUrl = safeUrl.replace(/[.,;:!?)]+$/, "");
    var trailing = safeUrl.slice(cleanUrl.length);
    return prefix + '<a href="' + cleanUrl + '" target="_blank" rel="sponsored nofollow noopener noreferrer">' + cleanUrl + '</a>' + trailing;
  });

  // Convert newlines to <br> for proper display
  escaped = escaped.replace(/\n/g, "<br>");

  return escaped;
}

/* ----------------------------------------------------------
   Append a message bubble to the chat window
   ---------------------------------------------------------- */

function appendMessage(role, text, showDisclosure) {
  if (!chatWindow) return;
  var row = document.createElement("div");
  row.className = "message-row " + (role === "user" ? "user" : "assistant");

  var bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.innerHTML = linkify(text) + (role !== "user" && showDisclosure ? DISCLOSURE_HTML : "");

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* ----------------------------------------------------------
   Typing indicator — animated dots
   ---------------------------------------------------------- */

function showTypingIndicator() {
  if (!chatWindow) return null;

  var row = document.createElement("div");
  row.className = "message-row assistant";
  row.id = "typing-indicator-row";

  var bubble = document.createElement("div");
  bubble.className = "message-bubble typing-indicator";
  bubble.innerHTML =
    '<span class="typing-dots">' +
    '<span class="typing-dot"></span>' +
    '<span class="typing-dot"></span>' +
    '<span class="typing-dot"></span>' +
    '</span>';

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return row;
}

function removeTypingIndicator() {
  var indicator = document.getElementById("typing-indicator-row");
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

/* ----------------------------------------------------------
   Manage conversation length on the frontend
   ---------------------------------------------------------- */

function getManagedConversation() {
  var systemMsgs = [];
  var otherMsgs = [];
  for (var i = 0; i < conversation.length; i++) {
    if (conversation[i].role === "system") {
      systemMsgs.push(conversation[i]);
    } else {
      otherMsgs.push(conversation[i]);
    }
  }
  // Trim to last MAX_FRONTEND_MESSAGES non-system messages
  if (otherMsgs.length > MAX_FRONTEND_MESSAGES) {
    otherMsgs = otherMsgs.slice(otherMsgs.length - MAX_FRONTEND_MESSAGES);
  }
  return systemMsgs.concat(otherMsgs);
}

/* ----------------------------------------------------------
   Send message to backend
   ---------------------------------------------------------- */

var isSending = false;

async function sendMessage(message) {
  if (isSending) return;
  isSending = true;

  // Disable input while sending
  if (chatSendBtn) chatSendBtn.disabled = true;
  if (userInput) userInput.disabled = true;

  appendMessage("user", message);
  conversation.push({ role: "user", content: message });

  var typingRow = showTypingIndicator();

  try {
    var response = await fetch("/.netlify/functions/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: getManagedConversation() })
    });

    var data = await response.json();
    var reply = data.reply || "I'm sorry, I didn't receive a response. Please try again in a moment.";

    conversation.push({ role: "assistant", content: reply });

    removeTypingIndicator();
    appendMessage("assistant", reply, !!data.hasAffiliate);
  } catch (err) {
    removeTypingIndicator();
    appendMessage("assistant", "I ran into a technical issue reaching the AI service. Please try again shortly.");
    console.error("Chat error:", err);
  } finally {
    isSending = false;
    if (chatSendBtn) chatSendBtn.disabled = false;
    if (userInput) {
      userInput.disabled = false;
      userInput.focus();
    }
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

/* ----------------------------------------------------------
   Starter question buttons
   ---------------------------------------------------------- */

function handleStarterQuestion(text) {
  if (!userInput || isSending) return;
  userInput.value = "";
  sendMessage(text);

  // Hide starter questions after first use
  var starterSection = document.getElementById("starter-questions");
  if (starterSection) {
    starterSection.style.display = "none";
  }
}

// Expose globally for onclick handlers in HTML
window.handleStarterQuestion = handleStarterQuestion;

/* ----------------------------------------------------------
   Welcome message on page load
   ---------------------------------------------------------- */

function showWelcomeMessage() {
  if (!chatWindow) return;

  var welcomeText =
    "Hello, and thank you for reaching out. Whatever brought you here, you're welcome to take this at your own pace — there is no rush.\n\n" +
    "I'm an AI assistant (not a human and not a licensed professional) with broad knowledge of funeral and burial costs, the FTC Funeral Rule, veteran and Social Security benefits, cremation vs. burial tradeoffs, and how to avoid overpaying.\n\n" +
    "You can ask me anything — for example:\n" +
    "- \"My dad just passed, what do I do in the next few hours?\"\n" +
    "- \"We were quoted $9,000 and it feels high. What should I ask?\"\n" +
    "- \"What help exists when we can't afford a funeral?\"\n" +
    "- \"Is this preneed contract a good idea?\"\n\n" +
    "If you prefer, tap one of the suggested questions below, or just tell me a little about your situation in your own words.";

  appendMessage("assistant", welcomeText);
}

/* ----------------------------------------------------------
   Initialize chat form and events
   ---------------------------------------------------------- */

if (chatForm && userInput) {
  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = userInput.value.trim();
    if (!text || isSending) return;
    userInput.value = "";

    // Hide starter questions on first message
    var starterSection = document.getElementById("starter-questions");
    if (starterSection) {
      starterSection.style.display = "none";
    }

    sendMessage(text);
  });

  userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });

  // Auto-resize textarea as user types
  userInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 120) + "px";
  });
}

/* ----------------------------------------------------------
   Show welcome message on page load
   ---------------------------------------------------------- */

if (chatWindow) {
  showWelcomeMessage();
}
