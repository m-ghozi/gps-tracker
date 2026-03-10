const db = require("../config/database");

async function registerDevice(req, res) {
  const { name, imei } = req.body;

  await db.query("INSERT INTO devices (name, imei) VALUES (?, ?)", [
    name,
    imei,
  ]);

  res.json({ message: "Device registered" });
}

module.exports = { registerDevice };
