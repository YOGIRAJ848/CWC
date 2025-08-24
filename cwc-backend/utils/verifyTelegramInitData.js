const crypto = require("crypto");

/**
 * Verify Telegram WebApp initData string
 * @param {string} initData - window.Telegram.WebApp.initData
 * @param {string} botToken - your bot token
 * @returns {object|null} parsedData or null if invalid
 */
function verifyTelegramInitData(initData, botToken) {
  if (!initData || !botToken) return null;

  // Parse querystring into object
  const data = Object.fromEntries(new URLSearchParams(initData));
  if (!data.hash) return null;

  const { hash, ...fields } = data;

  // Create data_check_string
  const checkArr = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`);
  const dataCheckString = checkArr.join("\n");

  // secret key = HMAC_SHA256(botToken)
  const secret = crypto.createHash("sha256").update(botToken).digest();

  // HMAC SHA256 of data_check_string with secret
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  if (hmac !== hash) return null;

  // parse user JSON if present
  if (fields.user) {
    try {
      fields.user = JSON.parse(fields.user);
    } catch {}
  }

  return fields;
}

module.exports = { verifyTelegramInitData };
