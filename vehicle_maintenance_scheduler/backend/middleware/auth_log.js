const http = require("http");

const VALID_STACKS = new Set(["backend", "frontend"]);
const VALID_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const VALID_PACKAGES = new Set(["auth", "config", "middleware", "utils"]);

const LOG_HOST = process.env.LOG_API_HOST || "20.207.122.201";
const LOG_PORT = Number(process.env.LOG_API_PORT || 80);
const LOG_PATH = process.env.LOG_API_PATH || "/evaluation-service/logs";
const LOG_AUTH_TOKEN = process.env.LOG_API_TOKEN || "";

function validateLogPayload(stack, level, packageName, message) {
  if (!VALID_STACKS.has(stack)) {
    throw new Error(`Invalid stack value: ${stack}`);
  }

  if (!VALID_LEVELS.has(level)) {
    throw new Error(`Invalid level value: ${level}`);
  }

  if (!VALID_PACKAGES.has(packageName)) {
    throw new Error(`Invalid package value: ${packageName}`);
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    throw new Error("Log message must be a non-empty string");
  }
}

function Log(stack, level, packageName, message) {
  try {
    validateLogPayload(stack, level, packageName, message);
  } catch (validationError) {
    console.error(`[logger] ${validationError.message}`);
    return Promise.resolve({
      ok: false,
      reason: "validation_failed",
      error: validationError.message,
    });
  }

  const requestBody = JSON.stringify({
    stack,
    level,
    package: packageName,
    message,
  });

  const headers = {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(requestBody),
  };

  if (LOG_AUTH_TOKEN) {
    headers.Authorization = `Bearer ${LOG_AUTH_TOKEN}`;
  }

  return new Promise((resolve) => {
    const request = http.request(
      {
        hostname: LOG_HOST,
        port: LOG_PORT,
        path: LOG_PATH,
        method: "POST",
        headers,
      },
      (response) => {
        let responseBody = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          responseBody += chunk;
        });

        response.on("end", () => {
          let parsedResponse = null;

          if (responseBody) {
            try {
              parsedResponse = JSON.parse(responseBody);
            } catch (parseError) {
              parsedResponse = { raw: responseBody };
            }
          }

          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            statusCode: response.statusCode,
            data: parsedResponse,
          });
        });
      }
    );

    request.on("error", (error) => {
      console.error(`[logger] Failed to send log: ${error.message}`);
      resolve({
        ok: false,
        reason: "request_failed",
        error: error.message,
      });
    });

    request.write(requestBody);
    request.end();
  });
}

module.exports = Log;
