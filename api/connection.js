const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION, {
      maxPoolSize: 15,
    });
    console.log("DB connection successful!");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
