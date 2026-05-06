const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const serviceRoutes = require("./routes/serviceRoutes");
const Log = require("./middleware/auth_log");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await Log(
    "backend",
    "info",
    "middleware",
    `Incoming request: ${req.method} ${req.originalUrl}`
  );
  next();
});

app.use("/evaluation-service", serviceRoutes);

app.use(async (req, res) => {
  await Log(
    "backend",
    "warn",
    "middleware",
    `Unhandled route requested: ${req.method} ${req.originalUrl}`
  );
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await Log(
    "backend",
    "info",
    "config",
    `Backend server started on port ${PORT}`
  );
});
