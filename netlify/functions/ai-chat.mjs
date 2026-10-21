// AI chat endpoint (served at /.netlify/functions/ai-chat).
// Uses the OpenAI-compatible credentials that Netlify AI Gateway injects
// into the modern function runtime (OPENAI_API_KEY / OPENAI_BASE_URL).

import { SYSTEM_PROMPT, AFFILIATE_DOMAINS } from "./chat-config.mjs";
import { isCrisis, CRISIS_REPLY } from "./crisis.mjs";

// Same-origin only. The old "*" let any website call this endpoint.
const ALLOWED_ORIGINS = ["https://funeralcostanalyzer.com", "https://www.funeralcostanalyzer.com"];
const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "https://funeralcostanalyzer.com",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin"
};

// Best-effort per-instance limiter; pair with a Netlify rate-limit rule (README).
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 30;
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

function hasAffiliateLink(text) {
  const urls = text.match(/https?:\/\/[^\s)<>"\]]+/g) || [];
  return urls.some((u) => {
    let h = "";
    try { h = new URL(u.replace(/[.,;:!?]+$/, "")).hostname.replace(/^www\./, "").toLowerCase(); } catch { return false; }
    return AFFILIATE_DOMAINS.some((d) => h === d || h.endsWith("." + d));
  });
}

const MODEL = "gpt-4.1-mini";
const MAX_CONVERSATION_MESSAGES = 20;
const REQUEST_TIMEOUT_MS = 25000;

function reply(status, text, extra = {}) {
  return new Response(JSON.stringify({ reply: text, ...extra }), { status, headers: CORS_HEADERS });
}

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return reply(405, "Please send a POST request with your messages.");
  }

  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const okOrigin = origin ? ALLOWED_ORIGINS.includes(origin) : ALLOWED_ORIGINS.some((o) => referer.startsWith(o + "/"));
  if (!okOrigin) {
    return reply(403, "Forbidden.");
  }

  const ip = (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || "unknown";
  if (rateLimited(ip)) {
    return reply(429, "You've sent a lot of messages in a short time. Please wait a few minutes and try again.");
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

  // Only user/assistant turns are accepted; any client "system" message is
  // dropped and the server-side prompt is used instead.
  let turns = messages
    .filter((msg) => msg && (msg.role === "user" || msg.role === "assistant") && typeof msg.content === "string")
    .map((msg) => ({ role: msg.role, content: msg.content.slice(0, 2000) }));
  if (turns.length > MAX_CONVERSATION_MESSAGES) {
    turns = turns.slice(turns.length - MAX_CONVERSATION_MESSAGES);
  }
  // Crisis screen before any model call: fixed resources, no products, no links.
  if (turns.some((m) => m.role === "user" && isCrisis(m.content))) {
    return new Response(JSON.stringify({ reply: CRISIS_REPLY, hasAffiliate: false, crisis: true }), { status: 200, headers: CORS_HEADERS });
  }
  const managedMessages = turns.length ? [{ role: "system", content: SYSTEM_PROMPT }, ...turns] : [];

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

  const content = parsed?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return reply(200, "I'm not sure how to respond to that right now, but you can try asking again or in a different way.", { hasAffiliate: false });
  }
  return reply(200, content, { hasAffiliate: hasAffiliateLink(content) });
};
