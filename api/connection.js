const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = async () => {
  const DB = process.env.MONGO_CONNECTION;

  try {
    await mongoose.connect(DB, {
      maxPoolSize: 15, // Set maxPoolSize
    });
    console.log("DB connection successful!");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
