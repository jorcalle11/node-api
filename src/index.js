const express = require("express");
const app = express();
const db = require("./db/pool");

const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const number1 = Math.floor(Math.random() * 10);
  const number2 = Math.floor(Math.random() * 10);
  console.log(`Generated numbers: ${number1}, ${number2}`);
  const { rows, fields } = await db.query("SELECT ? + ? AS sum", [
    number1,
    number2,
  ]);

  console.log("Query results:", rows);

  res.send({
    message: "Hello, World!",
    number1,
    number2,
    sum: rows[0]?.sum,
  });
});

app.get("/health", async (req, res) => {
  const response = await db.query("SELECT 1 + 1 AS result");
  console.log(response);

  res.status(200).send(`Server is healthy. Environment: ${env}`);
});

app.listen(port, () => {
  db.createPool();
  console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
// Close DB pool when the app is terminated or interrupted by the user
// This happens when you press Ctrl+C in the terminal
process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await db.closePool();
  process.exit(0);
});

// This happens when the app is terminated by the system
// For example, when the system is shutting down or restarting
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await db.closePool();
  process.exit(0);
});
