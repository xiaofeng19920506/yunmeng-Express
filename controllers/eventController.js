const Event = require("../models/eventModel.js");
const factory = require("./factory.js");

exports.createEvent = factory.createOne(Event);
exports.getAllEvent = factory.getAll(Event);
exports.updateEvent = factory.updateOne(Event);