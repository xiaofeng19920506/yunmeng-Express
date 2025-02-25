const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: [true, "Event title cannot be empty!"],
  },
  eventContent: {
    type: Array,
    required: [true, "Event content cannot be empty!"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "candy_users",
    required: [true, "Owner must exist"],
  },
});

const Event = mongoose.model("yunmen_events", eventSchema);
module.exports = Event;
