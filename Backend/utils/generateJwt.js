const jwt = require("jsonwebtoken");

const generateToken = async (payload, secretKey, expiresIn) => {
  return await jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = generateToken;
