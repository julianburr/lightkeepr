const express = require("express");
const admin = require("firebase-admin");
const bearerToken = require("express-bearer-token");
const cors = require("cors");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});

const app = express();
const port = process.env.PORT;

app.options("*", cors());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));
app.use(bearerToken());

app.get("/ping", async (_, res) => {
  res.send({ pong: new Date().getTime() });
});

app.use("/builds", require("./builds"));
app.use("/reports", require("./reports"));

if (port) {
  app.list(port, () => console.log(`Server started: http://localhost:${port}`));
}

module.exports = app;
