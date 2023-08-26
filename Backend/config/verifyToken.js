const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRETKEY;
const createError = require("http-errors");

// token
module.exports.verifyToken = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return next(createError(400, "Please Add Authorization Token !"));
    }

    // Extract token from Authorization header and verify it
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, secretKey);

    // Attach token payload (user information) to request object for further use
    req.user = payload;

    // Call the next middleware function in the chain
    next();
  } catch (err) {
    // Handle different types of errors that may occur during verification
    if (err.name === "TokenExpiredError") {
      return next(createError(401, "Sorry, the session has expired."));
    }
    if (err.name === "JsonWebTokenError") {
      return next(createError(401, "Authorization is required."));
    }
    return next(createError(500, "Internal server error."));
  }
};
