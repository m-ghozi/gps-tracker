const net = require("net");
const parser = require("./parser");

function startTcpServer(port) {
  const server = net.createServer((socket) => {
    console.log("Tracker connected:", socket.remoteAddress);

    socket.on("data", async (data) => {
      const message = data.toString();

      console.log("RAW:", message);

      const parsed = parser.parse(message);

      if (parsed) {
        console.log("GPS:", parsed);
      }
    });

    socket.on("end", () => {
      console.log("Tracker disconnected");
    });
  });

  server.listen(port, () => {
    console.log("TCP GPS Server running on port", port);
  });
}

module.exports = startTcpServer;
