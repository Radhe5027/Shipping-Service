const jwt = require("jsonwebtoken");
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ meassage: "Access denied, no token provided" });
  }
  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role_id !== 2) {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    req.user = decoded; // Attach decoded user information to request
    next(); // proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyAdmin };
