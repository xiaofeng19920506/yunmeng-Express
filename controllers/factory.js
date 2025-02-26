const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { isOwner } = require("../utils/user");
exports.getOne = (Modal) => {
  return catchAsync(async (req, res, next) => {
    const user = await isOwner(req, next);

    const userEvent = user.holdEvents.find(
      (event) => event._id.toString() === req.params.id
    );

    if (!userEvent) {
      return next(new appError("User doesn't hold this event", 404));
    }

    const event = await Modal.findOne({ _id: userEvent._id });
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

    const holdEvents = await Promise.all(
      user.holdEvents.map(async (eventId) => {
        try {
          const event = await Modal.findOne({ _id: eventId });
          return event;
        } catch (error) {
          console.error(error);
          throw new appError("No event found", 404);
        }
      })
    );
    res.status(200).json({
      status: "success",
      data: holdEvents,
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
    console.log(event);

    if (!event) {
      return next(new appError("No event is created", 404));
    }

    user.holdEvents.push(event);
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
