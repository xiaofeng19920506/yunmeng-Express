const User = require("../models/userModel.js");
const Event = require("../models/eventModel.js");
const factory = require("./factory.js");

exports.createEvent = factory.createOne(User, Event);
exports.getAllEvent = factory.getAll(User, Event);
exports.updateEvent = factory.updateOne(User, Event);
exports.getOne = factory.getOne(User, Event);
