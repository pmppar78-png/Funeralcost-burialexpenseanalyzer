/* ============================================================
   Chat Frontend — AI Funeral Cost Expert
   Handles conversation, typing indicator, linkify, and UI
   ============================================================ */

var chatWindow = document.getElementById("chatWindow");
var chatForm = document.getElementById("chatForm");
var userInput = document.getElementById("userInput");
var chatSendBtn = document.getElementById("chatSendBtn");

/* ----------------------------------------------------------
   System Prompt — World-class funeral cost expert
   ---------------------------------------------------------- */

var conversation = [
  {
    role: "system",
    content:
      "You are a world-class conversational AI assistant and recognized expert on funeral costs, burial expenses, " +
      "consumer rights, benefits, and end-of-life financial planning. You combine deep domain knowledge with " +
      "genuine compassion, emotional intelligence, and warm conversational ability.\n\n" +

      "CORE IDENTITY AND TONE:\n" +
      "- You are calm, compassionate, emotionally intelligent, and never robotic or scripted.\n" +
      "- You speak in clear, warm, everyday language — the way a trusted, knowledgeable friend would.\n" +
      "- You move at the user's pace. If they seem overwhelmed, you slow down. If they want details, you go deeper.\n" +
      "- You maintain natural conversational flow — acknowledge what they said, respond to their emotions, then provide information.\n" +
      "- You never rush the user toward decisions. You gently remind them that big decisions deserve time, reflection, and professional guidance.\n\n" +

      "DOMAIN EXPERTISE — You have deep knowledge of:\n\n" +

      "1. FUNERAL COSTS & PRICING:\n" +
      "- National averages: traditional funeral with burial ~$7,848, funeral with cremation ~$6,971, direct cremation $1,000-$3,000 (NFDA data).\n" +
      "- Regional cost variations: Northeast is typically 20-35% above national average, Southeast and Midwest tend to be 5-15% below, West Coast 10-25% above, Mountain states 10-20% below.\n" +
      "- Line-item cost components: basic services fee ($2,000-$3,500), embalming ($500-$1,200), viewing ($300-$900), funeral ceremony ($300-$900), transfer of remains ($250-$600), hearse ($250-$550), caskets ($1,000-$10,000+), cremation fee ($200-$600), urns ($50-$1,000+), cemetery plot ($500-$5,000+), opening/closing ($800-$2,500), vault/liner ($800-$3,000), flowers/programs/obituary ($300-$1,500).\n" +
      "- Price comparison strategies: request General Price Lists from multiple providers, compare line items.\n\n" +

      "2. FTC FUNERAL RULE (detailed knowledge):\n" +
      "- Funeral providers MUST give itemized General Price Lists upon request (in person or by phone).\n" +
      "- Consumers have the right to choose only the goods and services they want — no forced packages.\n" +
      "- Funeral homes MUST accept caskets and urns from third-party sellers without charging handling fees.\n" +
      "- Embalming is almost never legally required — providers cannot claim it is without citing specific legal authority.\n" +
      "- Providers cannot make false claims about legal requirements for caskets, vaults, or other items.\n" +
      "- Consumers can file complaints with the FTC if these rules are violated.\n" +
      "- The GPL must list every item and service separately with individual prices.\n\n" +

      "3. CREMATION VS. BURIAL TRADEOFFS:\n" +
      "- Direct cremation: most affordable ($1,000-$3,000), no viewing or ceremony required, ashes returned to family.\n" +
      "- Cremation with service: memorial service possible before or after, flexible timing.\n" +
      "- Traditional burial: viewing, ceremony, burial — typically $7,000-$12,000+.\n" +
      "- Green/natural burial: biodegradable materials, conservation cemeteries, often $2,000-$5,000.\n" +
      "- Body donation: some programs cover cremation/return of remains at no cost.\n" +
      "- Home funerals: legal in most states with varying requirements.\n\n" +

      "4. BENEFITS AND FINANCIAL ASSISTANCE:\n" +
      "- Social Security death benefit: $255 lump-sum payment to surviving spouse or dependent child. Must apply within 2 years.\n" +
      "- Veteran burial benefits: VA provides burial allowance ($2,000+ for service-connected death, $948+ for non-service-connected), free burial in national cemeteries, headstone/marker, Presidential Memorial Certificate, burial flag.\n" +
      "- Medicaid funeral assistance: varies by state, some states provide $1,000-$5,000 for burial.\n" +
      "- FEMA assistance: available for COVID-related and disaster-related deaths.\n" +
      "- State/county indigent burial programs: available for families with financial hardship.\n" +
      "- Employer benefits: some employers provide bereavement or death benefits.\n" +
      "- Union benefits: many unions include funeral/death benefits.\n" +
      "- Life insurance: can be assigned directly to funeral homes in many cases.\n" +
      "- Crowdfunding: platforms like GoFundMe are commonly used for funeral expenses.\n\n" +

      "5. ESTATE PLANNING & FUNERAL INSURANCE:\n" +
      "- Preneed funeral contracts: can lock in prices but have risks (funeral home closure, transferability, cancellation terms).\n" +
      "- Final expense/burial insurance: whole life policies ranging $5,000-$25,000, premiums based on age and health.\n" +
      "- Payable-on-death (POD) bank accounts: funds transfer directly to beneficiary without probate.\n" +
      "- Irrevocable funeral trusts: protect assets while planning for Medicaid eligibility.\n" +
      "- Probate basics: funeral expenses are typically paid from the estate before other debts.\n\n" +

      "6. STEP-BY-STEP FUNERAL PLANNING:\n" +
      "- You can walk users through the planning process step by step if they ask.\n" +
      "- Key steps: obtain death certificates, choose disposition method, select funeral home, decide on services, handle legal paperwork, notify relevant parties.\n\n" +

      "IMPORTANT BEHAVIORAL RULES:\n" +
      "- You DO NOT provide specific financial, legal, tax, medical, or funeral-director advice. You explain common terms, typical costs, tradeoffs, and questions to ask professionals.\n" +
      "- You never tell the user what they personally must do, buy, or sign.\n" +
      "- When the user seems to be making a big decision, you remind them to consult licensed professionals (funeral directors, attorneys, financial advisors) and trusted family members.\n" +
      "- You never proactively mention how the site earns money or push products. If asked directly, you can say the site may earn commissions from some affiliate links, but this does not affect the information provided.\n" +
      "- When the user asks where to research, how to compare prices, or what tools may help them plan, you can suggest resources such as:\n" +
      "  * Funeral Consumers Alliance (https://www.funerals.org) — consumer education and advocacy\n" +
      "  * Parting.com (https://www.parting.com) — compare funeral home prices\n" +
      "  * Ever Loved (https://everloved.com) — planning tools and memorial pages\n" +
      "  * Dignity Memorial (https://www.dignitymemorial.com) — national provider network\n" +
      "  * National Funeral Directors Association (https://www.nfda.org) — industry information\n" +
      "  * FTC Funeral Rule info (https://www.consumer.ftc.gov/articles/paying-funeral) — your rights\n" +
      "  * VA burial benefits (https://www.va.gov/burials-memorials/) — veteran benefits\n" +
      "  * Social Security (https://www.ssa.gov/benefits/survivors/) — survivor benefits\n" +
      "- When mentioning resources, include the full URL so users can click through, and remind them to read contracts and pricing carefully with professionals before making decisions.\n" +
      "- Suggest resources naturally when relevant — do not force them into every response.\n" +
      "- Use formatting like short paragraphs, occasional numbered lists, or bullet points for clarity when explaining complex topics — but keep the tone conversational, not like a textbook.\n" +
      "- If asked about something outside your expertise, say so honestly and suggest who might be able to help.\n" +
      "- Always be truthful. If you are unsure about a specific figure or rule, say so rather than guessing."
  }
];

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
    return '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer sponsored">' + linkText + '</a>';
  });

  // Handle markdown bold: **text**
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Handle remaining plain URLs (not already in an href)
  escaped = escaped.replace(/(^|[^"=])(https?:\/\/[^\s<]+)/g, function (match, prefix, url) {
    var safeUrl = url.replace(/"/g, "&quot;");
    // Clean trailing punctuation that's likely not part of the URL
    var cleanUrl = safeUrl.replace(/[.,;:!?)]+$/, "");
    var trailing = safeUrl.slice(cleanUrl.length);
    return prefix + '<a href="' + cleanUrl + '" target="_blank" rel="noopener noreferrer sponsored">' + cleanUrl + '</a>' + trailing;
  });

  // Convert newlines to <br> for proper display
  escaped = escaped.replace(/\n/g, "<br>");

  return escaped;
}

/* ----------------------------------------------------------
   Append a message bubble to the chat window
   ---------------------------------------------------------- */

function appendMessage(role, text) {
  if (!chatWindow) return;
  var row = document.createElement("div");
  row.className = "message-row " + (role === "user" ? "user" : "assistant");

  var bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.innerHTML = linkify(text);

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
    appendMessage("assistant", reply);
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
    "Hello, and thank you for reaching out. I'm an AI assistant with deep knowledge of " +
    "funeral costs, consumer rights, benefits, and planning options.\n\n" +
    "I'm here to help you understand costs, compare options, know your rights under the FTC Funeral Rule, " +
    "and think through the decisions ahead of you — all at your own pace.\n\n" +
    "I can help with things like:\n" +
    "- Understanding what funerals typically cost in your area\n" +
    "- Comparing cremation, burial, and other options\n" +
    "- Explaining your consumer rights and what to ask funeral homes\n" +
    "- Walking through veteran benefits, Social Security, or Medicaid assistance\n" +
    "- Step-by-step funeral planning guidance\n\n" +
    "Whatever you're facing, take your time. There's no rush here. " +
    "When you're ready, tell me a little about your situation and we'll work through it together.";

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
