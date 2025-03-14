const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "username cannot be empty!"],
  },
  name: {
    type: String,
    required: [true, "user's name cannot be empty!"],
  },
  password: {
    type: String,
    required: [true, "password cannot be empty"],
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  holdEvents: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    default: [],
  },
  joinedEvents: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    default: [],
  },
});

const users = mongoose.model("candy_users", userSchema);
module.exports = users;
