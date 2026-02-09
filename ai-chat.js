const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: "Please send a POST request with your messages." })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: "I had trouble understanding that request. Please try again." })
    };
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Still respond gracefully, but make it clear this is a config issue
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply:
          "I couldn’t access the AI service because the API key is not available on the server. " +
          "The site owner will need to double-check the OPENAI_API_KEY setting and redeploy."
      })
    };
  }

  const postData = JSON.stringify({
    model: "gpt-4.1-mini",
    messages,
    temperature: 0.9,
    max_tokens: 600
  });

  const options = {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  const apiResponse = await new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, data }));
    });

    req.on("error", (error) => {
      resolve({
        status: 500,
        data: JSON.stringify({
          error: { message: error.message || "Network error" }
        })
      });
    });

    req.write(postData);
    req.end();
  });

  let parsed;
  try {
    parsed = JSON.parse(apiResponse.data || "{}");
  } catch (err) {
    parsed = {};
  }

  if (apiResponse.status < 200 || apiResponse.status >= 300) {
    const msg =
      (parsed.error && parsed.error.message) ||
      "The AI service returned an error. Please try again in a little while.";

    return {
      statusCode: apiResponse.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply:
          "I’m having trouble reaching the AI service right now. The technical message says: " +
          msg +
          " Please try again later."
      })
    };
  }

  const reply =
    parsed &&
    parsed.choices &&
    parsed.choices[0] &&
    parsed.choices[0].message &&
    parsed.choices[0].message.content
      ? parsed.choices[0].message.content
      : "I’m not sure how to respond to that right now, but you can try asking again or in a different way.";

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reply })
  };
};
