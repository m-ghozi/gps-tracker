function parse(packet) {
  // bersihkan karakter tambahan
  packet = packet.replace(/[()]/g, "");

  if (!packet.includes("BR")) return null;

  try {
    // ambil IMEI
    const imei = packet.substring(0, 12);

    // regex koordinat
    const match = packet.match(/(\d{4}\.\d+[NS])(\d{5}\.\d+[EW])/);

    if (!match) return null;

    const latRaw = match[1];
    const lonRaw = match[2];

    const latitude = convertCoordinate(latRaw);
    const longitude = convertCoordinate(lonRaw);

    return {
      imei,
      latitude,
      longitude,
    };
  } catch (err) {
    console.log("Parse error:", err);
    return null;
  }
}

function convertCoordinate(coord) {
  const direction = coord.slice(-1);
  const value = parseFloat(coord.slice(0, -1));

  const degrees = Math.floor(value / 100);
  const minutes = value - degrees * 100;

  let decimal = degrees + minutes / 60;

  if (direction === "S" || direction === "W") {
    decimal *= -1;
  }

  return decimal;
}

module.exports = { parse };
