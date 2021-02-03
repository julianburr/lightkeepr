const express = require("express");
const app = express();

const port = process.env.PORT;

app.get("/ping", (_, res) => {
  res.send({ pong: new Date().getTime() });
});

if (port) {
  app.list(port, () => console.log(`Server started: http://localhost:${port}`));
}

module.exports = app;
