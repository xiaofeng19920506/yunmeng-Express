const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { isUser } = require("../utils/user");

exports.getOne = (Modal) => {
  return catchAsync(async (req, res, next) => {
    const event = await Modal.findOne({ _id: req.params.id });
    if (!event) {
      return next(new appError("Event not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { event },
    });
  });
};

exports.getAll = (Modal) => {
  return catchAsync(async (req, res, next) => {
    const user = await isUser(req, next);
    const holdevents = await Modal.find({ _id: { $in: user.holdEvents } });
    const joinevents = await Modal.find({ _id: { $in: user.joinedEvents } });
    res.status(200).json({
      status: "success",
      data: { events: holdevents, joinedEvents: joinevents },
    });
  });
};

exports.deleteOne = (Modal) => {
  return catchAsync(async (req, res, next) => {
    const user = await isUser(req, next);

    const userEvent = user.holdEvents.find(
      (event) => event._id.toString() === req.params.id
    );

    if (!userEvent) {
      return next(new appError("User doesn't hold this event", 404));
    }

    const deletedEvent = await Modal.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return next(new appError("No event found with that id", 404));
    }

    res.status(204).json({ status: "success", data: null });
  });
};

exports.updateOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const user = await isUser(req, next);

    const userEventId = user.holdEvents.find(
      (eventId) => eventId.toString() === req.params.id
    );
    if (!userEventId) {
      return next(new appError("User doesn't hold this event", 404));
    }
    const updatedEvent = await Modal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return next(new appError("Event not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedEvent,
    });
  });

exports.createOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const user = await isUser(req, next);
    const event = await Modal.create(req.body);

    if (!event) {
      return next(new appError("No event is created", 404));
    }

    user.holdEvents.push(event);
    user.joinedEvents.push(event._id);
    await user.save();

    const result = {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      holdEvents: user.holdEvents,
      joinedEvents: user.joinedEvents,
    };
    res.status(201).json({
      status: "success",
      data: result,
    });
  });

exports.InviteOne = (EventModal, UserModal) =>
  catchAsync(async (req, res, next) => {
    const user = await isUser(req, next);
    const { id: eventId } = req.params;
    const { email } = req.body;

    if (!eventId) {
      return next(new appError("Event id must be provided", 400));
    }

    if (!email) {
      return next(new appError("Email must be provided", 400));
    }

    const invitedUser = await UserModal.findOne({ email });
    if (!invitedUser) {
      return next(new appError("No such user found", 404));
    }

    const currentEvent = await EventModal.findById(eventId);
    if (!currentEvent) {
      return next(new appError("No such event found", 404));
    }

    if (invitedUser.joinedEvents.includes(eventId)) {
      return next(new appError("User already invited to this event", 400));
    }

    const updatedUser = await UserModal.findOneAndUpdate(
      { _id: invitedUser._id },
      { $addToSet: { joinedEvents: eventId } },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      data: updatedUser,
    });
  });
