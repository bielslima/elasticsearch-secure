const jwt = require("jsonwebtoken");

module.exports = class Auth {
  static generateToken(payload) {
    return jwt.sign(payload, process.env.AUTH_SECRET, {
      expiresIn: 300,
    });
  }
  static verifyToken(token, cb) {
    return jwt.verify(token, process.env.AUTH_SECRET, cb);
  }

  static protectMiddlewareRoute(req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: "No token provided." });

    Auth.verifyToken(token, (err, decoded) => {
      if (err)
        return res
          .status(500)
          .json({ auth: false, message: "Failed to authenticate token." });

      req = {
        ...req,
        ...decoded,
      };

      next();
    });
  }
};
