const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) return res.status(403).json({ err });
      req.user = user;
      next();
    });
    //console.log(req.user);
  } catch (err) {
    res.status(401).json({
      message: "Auth failed",
    });
  }
};

module.exports = checkAuth;
