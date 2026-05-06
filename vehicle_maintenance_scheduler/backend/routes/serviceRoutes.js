const express = require("express");
const http = require("http");
const Log = require("../middleware/auth_log");

const router = express.Router();
const EVALUATION_HOST = "20.207.122.201";

function fetchJson(path) {
  return new Promise((resolve, reject) => {
    const request = http.get(
      {
        hostname: EVALUATION_HOST,
        port: 80,
        path,
      },
      (response) => {
        const { statusCode } = response;
        const contentType = response.headers["content-type"] || "";
        let rawData = "";

        if (statusCode !== 200) {
          response.resume();
          reject(new Error(`Request failed with status ${statusCode}`));
          return;
        }

        if (!/^application\/json/.test(contentType)) {
          response.resume();
          reject(
            new Error(
              `Expected application/json but received ${contentType || "unknown"}`
            )
          );
          return;
        }

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          rawData += chunk;
        });

        response.on("end", () => {
          try {
            resolve(JSON.parse(rawData));
          } catch (error) {
            reject(new Error(`Failed to parse JSON response: ${error.message}`));
          }
        });
      }
    );

    request.on("error", (error) => {
      reject(error);
    });
  });
}

router.get("/depots", async (req, res) => {
  await Log(
    "backend",
    "info",
    "utils",
    "Fetching depot data from evaluation service"
  );

  try {
    const depots = await fetchJson("/evaluation-service/depots");

    await Log(
      "backend",
      "info",
      "utils",
      "Depot data fetched successfully"
    );

    res.status(200).json(depots);
  } catch (error) {
    await Log(
      "backend",
      "error",
      "utils",
      `Depot fetch failed: ${error.message}`
    );

    res.status(502).json({
      message: "Failed to retrieve depots",
      error: error.message,
    });
  }
});

router.get("/vehicles", async (req, res) => {
  await Log(
    "backend",
    "info",
    "utils",
    "Fetching vehicle data from evaluation service"
  );

  try {
    const vehicles = await fetchJson("/evaluation-service/vehicles");

    await Log(
      "backend",
      "info",
      "utils",
      "Vehicle data fetched successfully"
    );

    res.status(200).json(vehicles);
  } catch (error) {
    await Log(
      "backend",
      "error",
      "utils",
      `Vehicle fetch failed: ${error.message}`
    );

    res.status(502).json({
      message: "Failed to retrieve vehicles",
      error: error.message,
    });
  }
});

module.exports = router;
