// Import the 'jsonwebtoken' library to handle JWT (JSON Web Token) verification
const jwt = require("jsonwebtoken");

// Middleware function to verify JWT token in the request header
const verifyToken = (req, res, next) => {
  // Retrieve the 'Authorization' header from the request
  const authHeader = req.headers["authorization"];

  // Check if the 'Authorization' header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If no token is found or it's not prefixed with 'Bearer ', deny access
    return res
      .status(401) // HTTP status code 401: Unauthorized
      .json({ message: "Access denied, no token provided" });
  }

  // Extract the token from the Authorization header (split the header by space and get the second part)
  const token = authHeader.split(" ")[1];

  // Check if the token exists
  if (!token) {
    // If no token is provided, deny access with a 401 status
    return res.status(401).json({ message: "Access denied no token provided" });
  }

  try {
    // Verify the token using the secret key (JWT_SECRET) stored in the environment variables
    // The jwt.verify() method decodes the token and checks if it's valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid, attach the decoded user data to the request object
    req.user = decoded; // This allows the next middleware or route handler to access the user data

    // Call the next middleware or route handler in the stack
    next();
  } catch (error) {
    // If there is an error in verification (e.g., the token is invalid or expired), deny access
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Export the verifyToken function so it can be used in other files (routes or middleware)
module.exports = { verifyToken };
