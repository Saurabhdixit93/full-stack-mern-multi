const crypto = require("crypto");

const generateResetToken = () => {
  const token = crypto.randomBytes(8).toString("hex");
  return token;
};

module.exports = { generateResetToken: generateResetToken };
