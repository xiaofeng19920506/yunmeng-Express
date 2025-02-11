const Events = require("../models/eventModel.js");
const factory = require("./factory.js");

exports.createEvent = factory.createOne(Events);
exports.getAllEvent = factory.getAll(Events);
exports.updateEvent = factory.updateOne(Events);
