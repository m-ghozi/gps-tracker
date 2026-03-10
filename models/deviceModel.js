const db = require("../config/database");

async function getDeviceByIMEI(imei) {
  const [rows] = await db.query("SELECT * FROM devices WHERE imei = ?", [imei]);
  return rows[0];
}

module.exports = { getDeviceByIMEI };
