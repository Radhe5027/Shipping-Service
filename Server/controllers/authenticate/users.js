const { models } = require("../../database/db"); // Importing database models
const { users, roles } = models; // Destructuring models to get 'users' and 'roles'
const bcrypt = require("bcryptjs"); // Importing bcrypt for hashing passwords
const jwt = require("jsonwebtoken"); // Importing JWT for token-based authentication

// Secret key for JWT (use a secure value in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Function to handle user signup
exports.signupUsers = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

    // Ensure all required fields are provided
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the email is already registered
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Validate role or assign default role as 'user'
    const userRole = role && ["admin", "user"].includes(role) ? role : "user";

    // Check if the role exists in the roles table
    const existingRole = await roles.findOne({
      where: { role_name: userRole },
    });
    if (!existingRole) {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    const user = await users.create({
      username,
      email,
      password: hashedPassword,
      role_id: existingRole.id, // Associate the role with the user
    });

    // Respond with success message and user details
    return res.status(201).json({
      message: "SignUp successful",
      role: userRole,
      userId: user.id,
    });
  } catch (error) {
    // Log the error for debugging and respond with a generic message
    console.error("Error during signup:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to handle user login
exports.signinUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT for the user
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Respond with success message, user details, and the token
    return res.status(200).json({
      message: "SignIn successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
      },
      token,
    });
  } catch (error) {
    // Log the error for debugging and respond with a generic message
    console.error("Error during sign-in:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
