function parse(packet) {
  if (!packet.includes("BR")) return null;

  try {
    const imei = packet.substring(0, 12);

    const latRaw = packet.substring(19, 28);
    const lonRaw = packet.substring(28, 38);

    return {
      imei,
      latitude: latRaw,
      longitude: lonRaw,
    };
  } catch (err) {
    return null;
  }
}

module.exports = { parse };
