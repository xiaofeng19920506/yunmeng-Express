const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username cannot be empty!"],
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
});

const users = mongoose.model("candy_users", userSchema);
module.exports = users;
