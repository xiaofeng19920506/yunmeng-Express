const events = require("../models/eventModel.js");
const factory = require("./factory.js");

exports.createEvent = factory.createOne(events);
exports.getAllEvent = factory.getAll(events);
exports.updateEvent = factory.updateOne(events);
