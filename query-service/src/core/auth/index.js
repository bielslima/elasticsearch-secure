const jwt = require("jsonwebtoken");

module.exports = class Auth {
  static generateToken(payload) {
    return jwt.sign(payload, process.env.AUTH_SECRET, {
      expiresIn: 300,
    });
  }
  static verifyToken(token) {
    return jwt.verify(token, process.env.AUTH_SECRET);
  }

  static protectMiddlewareRoute(req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: "No token provided." });

    const verifyToken = this.verifyToken(token);

    if (!verifyToken)
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });

    req = {
      ...req,
      ...verifyToken,
    };

    next();
  }
};
