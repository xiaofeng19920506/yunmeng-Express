const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const users = require("../models/userModel.js");

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await users.findOne({ username: username.toLowerCase() });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required." });
      }

      if (username !== user.user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  verifyToken: async (req, res, next) => {
    const authHeader = req.header["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "token is invalid or missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      return res
        .status(200)
        .json({ status: "success", message: "valid token" });
    } catch (error) {
      return res.status(403).json({ message: "invalid or expired token" });
    }
  },
  protectedByToken: async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing or invalid" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  },
};

module.exports = authController;
