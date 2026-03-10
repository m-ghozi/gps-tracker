require("dotenv").config();

const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./routes/deviceRoutes");
const positionRoutes = require("./routes/positionRoutes");
const startTcpServer = require("./tcp/server");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/devices", deviceRoutes);
app.use("/api/positions", positionRoutes);

app.get("/", (req, res) => {
  res.send("GPS Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log("API running on", process.env.PORT);
});

startTcpServer(process.env.TCP_PORT);
