const env = process.env.NODE_ENV || "development";

if (env === "development") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).send(`Server is healthy. Environment: ${env}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
