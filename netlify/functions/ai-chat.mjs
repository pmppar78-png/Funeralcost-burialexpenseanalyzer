// AI chat endpoint (served at /.netlify/functions/ai-chat).
// Uses the OpenAI-compatible credentials that Netlify AI Gateway injects
// into the modern function runtime (OPENAI_API_KEY / OPENAI_BASE_URL).

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

const MODEL = "gpt-4.1-mini";
const MAX_CONVERSATION_MESSAGES = 20;
const REQUEST_TIMEOUT_MS = 25000;

function reply(status, text) {
  return new Response(JSON.stringify({ reply: text }), { status, headers: CORS_HEADERS });
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return reply(405, "Please send a POST request with your messages.");
  }

  let body;
  try {
    const raw = await req.text();
    body = JSON.parse(raw || "{}");
  } catch (err) {
    return reply(400, "I had trouble understanding that request. Please try again.");
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];

  if (messages.length === 0) {
    return reply(400, "No messages were provided. Please type a message and try again.");
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

  if (!apiKey) {
    return reply(
      200,
      "I couldn't access the AI service because the API key is not available on the server. " +
        "The site owner will need to check the AI Gateway configuration and redeploy."
    );
  }

  // Sanitize and validate each message
  const sanitizedMessages = messages
    .filter((msg) => msg && typeof msg.role === "string" && typeof msg.content === "string")
    .map((msg) => {
      let role = msg.role;
      if (role !== "system" && role !== "assistant" && role !== "user") {
        role = "user";
      }
      return { role, content: msg.content.slice(0, 4000) };
    });

  // Conversation length management: keep system messages + last 20 messages
  // to prevent token limit issues on long conversations
  const systemMessages = sanitizedMessages.filter((m) => m.role === "system");
  let nonSystemMessages = sanitizedMessages.filter((m) => m.role !== "system");
  if (nonSystemMessages.length > MAX_CONVERSATION_MESSAGES) {
    nonSystemMessages = nonSystemMessages.slice(nonSystemMessages.length - MAX_CONVERSATION_MESSAGES);
  }
  const managedMessages = systemMessages.concat(nonSystemMessages);

  if (managedMessages.length === 0) {
    return reply(400, "No valid messages were provided. Please type a message and try again.");
  }

  let apiResponse;
  try {
    apiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: managedMessages,
        temperature: 0.7,
        max_tokens: 1200
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (error) {
    if (error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return reply(
        504,
        "The request to the AI service timed out. This can happen during peak usage. Please try again in a moment."
      );
    }
    return reply(
      500,
      "I'm having trouble reaching the AI service right now. Please try again in a moment."
    );
  }

  // Handle rate limiting specifically
  if (apiResponse.status === 429) {
    return reply(429, "The AI service is experiencing high demand right now. Please wait a moment and try again.");
  }

  // Handle authentication errors
  if (apiResponse.status === 401 || apiResponse.status === 403) {
    return reply(
      apiResponse.status,
      "There is an issue with the AI service configuration. The site owner has been notified. Please try again later."
    );
  }

  let parsed;
  try {
    parsed = JSON.parse((await apiResponse.text()) || "{}");
  } catch (err) {
    return reply(502, "I received an unexpected response from the AI service. Please try again in a moment.");
  }

  if (!apiResponse.ok) {
    return reply(
      apiResponse.status,
      "I'm having trouble reaching the AI service right now. " +
        "Please try again in a moment. If this continues, the issue is temporary and should resolve shortly."
    );
  }

  const content = parsed?.choices?.[0]?.message?.content;
  return reply(
    200,
    content
      ? content.trim()
      : "I'm not sure how to respond to that right now, but you can try asking again or in a different way."
  );
};
