const User = require("./userModel");

const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: [true, "event title cannot be empty!"],
  },
  eventDate: {
    type: Array,
    default: [],
  },
  eventOnwer: {
    type: User,
    required: true,
  },
  eventUsers: {
    type: Array,
    default: [],
  },
});

const YunMen_events = mongoose.model("YunMen_events", eventSchema);
module.exports = YunMen_events;
