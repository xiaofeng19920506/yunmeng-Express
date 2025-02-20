const User = require("../models/userModel.js");
const factory = require("./factory.js");

exports.createEvent = factory.createOne(User);
exports.getAllEvent = factory.getAll(User);
exports.updateEvent = factory.updateOne(User);
