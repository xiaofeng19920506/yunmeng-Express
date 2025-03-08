const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { isOwner } = require("../utils/user");

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
    const user = await isOwner(req, next);
    const events = await Modal.find({ _id: { $in: user.holdEvents } });
    res.status(200).json({
      status: "success",
      data: events,
    });
  });
};

exports.deleteOne = (Modal) => {
  return catchAsync(async (req, res, next) => {
    const user = await isOwner(req, next);

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
    const user = await isOwner(req, next);

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
    const user = await isOwner(req, next);
    const event = await Modal.create(req.body);

    if (!event) {
      return next(new appError("No event is created", 404));
    }

    user.holdEvents.push(event);
    user.joinedEvents.push(user._id);
    await user.save();

    const result = {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      holdEvents: user.holdEvents,
    };
    res.status(201).json({
      status: "success",
      data: result,
    });
  });

exports.joinOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const user = await isOwner(req, next);
    const eventId = req.body.eventId;
    if (!eventId) {
      return next(new appError("Event id must be provided", 400));
    }

    const event = await Modal.findOne({ _id: eventId });
    if (!event) {
      return next(new appError("Event not found", 404));
    }

    if (!user.joinedEvents.includes(event._id)) {
      user.joinedEvents.push(event._id);
      await user.save();
    }

    res.status(201).json({
      status: "success",
      data: user,
    });
  });
