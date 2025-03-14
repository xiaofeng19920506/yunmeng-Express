const Content = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content cannot be empty"],
    validate: {
      validator: function (v) {
        return typeof v === "string" && v.trim().length > 0;
      },
      message: "Content must be a non-empty string",
    },
  },
  joinedUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "candy_users",
    },
  ],
});

const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: [true, "Event title cannot be empty!"],
    trim: true,
  },
  eventContent: {
    type: [Content],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "Event content must be a non-empty array",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "candy_users",
    required: [true, "Owner must exist"],
  },
});
