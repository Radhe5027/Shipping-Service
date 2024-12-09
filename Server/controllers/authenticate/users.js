const { users, roles } = require("../../database/db").models;
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Replace with your secure key

exports.signupUsers = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const userRole = role && ["admin", "user"].includes(role) ? role : "user";
    const existingRole = await roles.findOne({
      where: { role_name: userRole },
    });
    if (!existingRole) {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await users.create({
      username,
      email,
      password: hashedPassword,
      role_id: existingRole.id,
    });

    return res.status(201).json({
      message: "SignUp successful",
      role: userRole,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     console.log("Incoming DELETE request for userId:", userId);

//     // Validate that userId is a number
//     if (isNaN(userId)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }

//     // Check if the user exists
//     const user = await users.findOne({ where: { id: userId } });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Perform the deletion
//     await users.destroy({ where: { id: userId } });

//     return res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error during user deletion:", error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.signinUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with user details and token
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
    console.error("Error during sign-in:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
