const https = require("https");

exports.handler = async (event) => {
  const CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reply: "Please send a POST request with your messages." })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reply: "I had trouble understanding that request. Please try again." })
    };
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];

  if (messages.length === 0) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reply: "No messages were provided. Please type a message and try again." })
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        reply:
          "I couldn't access the AI service because the API key is not available on the server. " +
          "The site owner will need to double-check the OPENAI_API_KEY setting and redeploy."
      })
    };
  }

  // Sanitize and validate each message
  const sanitizedMessages = messages
    .filter(function (msg) {
      return msg && typeof msg.role === "string" && typeof msg.content === "string";
    })
    .map(function (msg) {
      var role = msg.role;
      if (role !== "system" && role !== "assistant" && role !== "user") {
        role = "user";
      }
      return {
        role: role,
        content: msg.content.slice(0, 4000)
      };
    });

  // Conversation length management: keep system prompt + last 20 messages
  // This prevents token limit issues on long conversations
  var managedMessages = [];
  var systemMessages = [];
  var nonSystemMessages = [];

  for (var i = 0; i < sanitizedMessages.length; i++) {
    if (sanitizedMessages[i].role === "system") {
      systemMessages.push(sanitizedMessages[i]);
    } else {
      nonSystemMessages.push(sanitizedMessages[i]);
    }
  }

  // Always include system messages at the start
  managedMessages = systemMessages.slice();

  // Keep only the last 20 non-system messages to stay within token limits
  var MAX_CONVERSATION_MESSAGES = 20;
  if (nonSystemMessages.length > MAX_CONVERSATION_MESSAGES) {
    nonSystemMessages = nonSystemMessages.slice(nonSystemMessages.length - MAX_CONVERSATION_MESSAGES);
  }

  managedMessages = managedMessages.concat(nonSystemMessages);

  if (managedMessages.length === 0) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reply: "No valid messages were provided. Please type a message and try again." })
    };
  }

  var postData = JSON.stringify({
    model: "gpt-4.1-mini",
    messages: managedMessages,
    temperature: 0.7,
    max_tokens: 1200
  });

  var options = {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  var apiResponse = await new Promise(function (resolve) {
    var req = https.request(options, function (res) {
      var data = "";
      res.on("data", function (chunk) {
        data += chunk;
      });
      res.on("end", function () {
        resolve({ status: res.statusCode, data: data });
      });
    });

    req.on("error", function (error) {
      var errorMessage = "Network error";
      if (error && error.code === "ECONNRESET") {
        errorMessage = "Connection to the AI service was reset. Please try again.";
      } else if (error && error.code === "ENOTFOUND") {
        errorMessage = "Could not reach the AI service. Please check your connection.";
      } else if (error && error.message) {
        errorMessage = error.message;
      }
      resolve({
        status: 500,
        data: JSON.stringify({
          error: { message: errorMessage }
        })
      });
    });

    // 25 second timeout for Netlify function limits
    req.setTimeout(25000, function () {
      req.destroy();
      resolve({
        status: 504,
        data: JSON.stringify({
          error: { message: "The request to the AI service timed out. This can happen during peak usage. Please try again in a moment." }
        })
      });
    });

    req.write(postData);
    req.end();
  });

  var parsed;
  try {
    parsed = JSON.parse(apiResponse.data || "{}");
  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        reply: "I received an unexpected response from the AI service. Please try again in a moment."
      })
    };
  }

  // Handle rate limiting specifically
  if (apiResponse.status === 429) {
    return {
      statusCode: 429,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        reply: "The AI service is experiencing high demand right now. Please wait a moment and try again."
      })
    };
  }

  // Handle authentication errors
  if (apiResponse.status === 401 || apiResponse.status === 403) {
    return {
      statusCode: apiResponse.status,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        reply: "There is an issue with the AI service configuration. The site owner has been notified. Please try again later."
      })
    };
  }

  if (apiResponse.status < 200 || apiResponse.status >= 300) {
    var msg =
      (parsed.error && parsed.error.message) ||
      "The AI service returned an error. Please try again in a little while.";

    return {
      statusCode: apiResponse.status,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        reply:
          "I'm having trouble reaching the AI service right now. " +
          "Please try again in a moment. If this continues, the issue is temporary and should resolve shortly."
      })
    };
  }

  var reply =
    parsed &&
    parsed.choices &&
    parsed.choices[0] &&
    parsed.choices[0].message &&
    parsed.choices[0].message.content
      ? parsed.choices[0].message.content.trim()
      : "I'm not sure how to respond to that right now, but you can try asking again or in a different way.";

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ reply: reply })
  };
};
