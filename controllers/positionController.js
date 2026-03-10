const db = require("../config/database");

async function getLatestPositions(req, res) {
  try {
    const query = `
      SELECT d.imei, d.name, p.latitude, p.longitude, p.speed, p.course, p.device_time
      FROM devices d
      LEFT JOIN positions p ON d.id = p.device_id
      WHERE p.device_time = (
          SELECT MAX(device_time) FROM positions WHERE device_id = d.id
      ) OR p.device_id IS NULL OR p.id = (
          SELECT id FROM positions WHERE device_id = d.id ORDER BY device_time DESC LIMIT 1
      )
      GROUP BY d.id
    `;
    // a safer query for mysql 5.7+ or any mysql without ONLY_FULL_GROUP_BY issues:
    const safeQuery = `
      SELECT d.imei, d.name, p.latitude, p.longitude, p.speed, p.course, p.device_time
      FROM devices d
      LEFT JOIN (
          SELECT p1.*
          FROM positions p1
          INNER JOIN (
              SELECT device_id, MAX(device_time) as max_time
              FROM positions
              GROUP BY device_id
          ) p2 ON p1.device_id = p2.device_id AND p1.device_time = p2.max_time
      ) p ON d.id = p.device_id
    `;
    const [positions] = await db.query(safeQuery);
    res.json(positions);
  } catch (error) {
    console.error("Error fetching latest positions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getPositionHistory(req, res) {
  try {
    const { imei } = req.params;
    const query = `
      SELECT p.latitude, p.longitude, p.speed, p.course, p.device_time
      FROM positions p
      JOIN devices d ON p.device_id = d.id
      WHERE d.imei = ?
      ORDER BY p.device_time DESC
    `;
    const [history] = await db.query(query, [imei]);
    res.json(history);
  } catch (error) {
    console.error("Error fetching position history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getLatestPositions, getPositionHistory };
