const net = require("net");
const parser = require("./parser");
const db = require("../config/database");
const { getDeviceByIMEI } = require("../models/deviceModel");

function startTcpServer(port) {
  const server = net.createServer(async (socket) => {
    console.log("Tracker connected:", socket.remoteAddress);

    socket.on("data", async (data) => {
      const message = data.toString();

      console.log("RAW:", message);

      const parsed = parser.parse(message);

      console.log("PARSED:", parsed);

      if (!parsed || isNaN(parsed.latitude) || isNaN(parsed.longitude)) {
        console.log("Invalid GPS data");
        return;
      }

      const device = await getDeviceByIMEI(parsed.imei);

      if (!device) {
        console.log("Device not registered:", parsed.imei);
        return;
      }

      await db.query(
        `INSERT INTO positions
        (device_id, latitude, longitude, speed, course, device_time)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          device.id,
          parsed.latitude,
          parsed.longitude,
          parsed.speed,
          parsed.course,
        ],
      );

      console.log("Position saved");
    });
  });

  server.listen(port, () => {
    console.log("GPS TCP Server running on port", port);
  });
}

module.exports = startTcpServer;
