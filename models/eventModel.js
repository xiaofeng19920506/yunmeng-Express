const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: [true, "event title cannot be empty!"],
  },
  eventDate: {
    type: Array,
    default: [],
  },
  // eventOnwer: {
  //   type: User,
  //   required: true,
  // },
  eventUsers: {
    type: Array,
    default: [],
  },
});

const events = mongoose.model("YunMen_events", eventSchema);
module.exports = events;
