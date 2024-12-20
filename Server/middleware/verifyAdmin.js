// Import the 'jsonwebtoken' library to handle JWT (JSON Web Token) verification
const jwt = require("jsonwebtoken");

// Middleware function to verify if the user has admin privileges
const verifyAdmin = (req, res, next) => {
  // Retrieve the 'Authorization' header from the incoming request
  const authHeader = req.headers["authorization"];

  // If no 'Authorization' header is provided, return a 401 Unauthorized error
  if (!authHeader) {
    return res
      .status(401) // HTTP status code 401: Unauthorized
      .json({ message: "Access denied, no token provided" }); // Response message
  }

  // Extract the token from the Authorization header (split by space and get the second part)
  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    // Verify the token using the secret key (JWT_SECRET) stored in environment variables
    // The jwt.verify() method decodes the token and checks if it's valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded role_id is not equal to 2 (assuming role_id 2 is for admin)
    // If the user is not an admin, return a 403 Forbidden error
    if (decoded.role_id !== 2) {
      return res.status(403).json({ message: "Access denied, admin only" }); // Forbidden error
    }

    // If the user is an admin, attach the decoded user data to the request object
    req.user = decoded; // This allows the next middleware or route handler to access the user data

    // Call the next middleware or route handler in the stack
    next();
  } catch (error) {
    // If there is an error (e.g., the token is invalid or expired), deny access
    return res.status(401).json({ message: "Invalid token" }); // Unauthorized error
  }
};

// Export the verifyAdmin function so it can be used in other files (routes or middleware)
module.exports = { verifyAdmin };
