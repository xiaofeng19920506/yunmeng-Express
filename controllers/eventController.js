const Event = require("../models/eventModel.js");
const User = require("../models/userModel.js");
const factory = require("./factory.js");

exports.createEvent = factory.createOne(Event);
exports.getAllEvent = factory.getAll(Event);
exports.updateEvent = factory.updateOne(Event);
exports.getOne = factory.getOne(Event);
exports.deleteOne = factory.deleteOne(Event, User);
exports.inviteUser = factory.InviteOne(Event, User);
