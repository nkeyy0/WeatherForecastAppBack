const jwt = require("jsonwebtoken");
const secretKey = process.env.jwtSecretKey;

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    res.status(401).json({
      message: "Token not provided!",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token!",
    });
  }
};
