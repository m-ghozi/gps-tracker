const db = require("../config/database");

async function registerDevice(req, res) {
  const { name, imei } = req.body;

  await db.query("INSERT INTO devices (name, imei) VALUES (?, ?)", [
    name,
    imei,
  ]);

  res.json({ message: "Device registered" });
}

async function getDevices(req, res) {
  try {
    const [devices] = await db.query("SELECT * FROM devices");
    res.json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { registerDevice, getDevices };
