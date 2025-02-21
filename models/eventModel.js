const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: [true, "event title cannot be empty!"],
  },
  eventContent: {
    type: String,
    required: [true, "event title cannot be empty!"],
  },
});

const events = mongoose.model("yunmen_events", eventSchema);
module.exports = events;
