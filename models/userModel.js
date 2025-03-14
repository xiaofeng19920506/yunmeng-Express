const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  joinedUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email cannot be empty!"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "User's name cannot be empty!"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty!"],
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  holdEvents: {
    type: [eventSchema],
    default: [],
  },
  joinedEvents: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    default: [],
  },
});

const User = mongoose.model("candy_users", userSchema);
module.exports = User;
