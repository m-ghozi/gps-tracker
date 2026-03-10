require("dotenv").config();

const express = require("express");
const startTcpServer = require("./tcp/server");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("GPS Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log("API running on port", process.env.PORT);
});

startTcpServer(process.env.TCP_PORT);
