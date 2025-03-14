const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { isUser } = require("../utils/user");

exports.getOne = (Modal) => {
  return catchAsync(async (req, res, next) => {
    const event = await Modal.findOne({ _id: req.params.id }).populate(
      "eventContent.joinedUser",
      "name email"
    );
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
    const eventIds = [
      ...user.holdEvents.map((id) => id.toString()),
      ...user.joinedEvents.map((id) => id.toString()),
    ];
    const events = await Modal.find({
      _id: { $in: eventIds },
    });

    res.status(200).json({
      status: "success",
      data: { events },
    });
  });
};

exports.deleteOne = (EventModal, UserModal) => {
  return catchAsync(async (req, res, next) => {
    const user = await isUser(req, next);
    const id = req.params.id;
    const userEvent = user.holdEvents.find(
      (event) => event._id.toString() === id
    );

    if (!userEvent) {
      return next(new appError("User doesn't hold this event", 404));
    }

    const deletedEvent = await EventModal.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return next(new appError("No event found with that id", 404));
    }

    await UserModal.updateMany(
      { joinedEvents: id },
      { $pull: { joinedEvents: id } }
    );

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

    const eventData = {
      eventTitle: req.body.eventTitle.map((title) => ({ title })),
      eventContent: req.body.eventContent.map((content) => ({
        content,
        joinedUser: [],
      })),
      owner: user._id,
    };

    const event = await Modal.create(eventData);

    if (!event) {
      return next(new appError("No event is created", 404));
    }

    user.holdEvents.push(event._id);
    // Remove the following line to prevent owner from being added to joinedEvents
    // user.joinedEvents.push(event._id);
    await user.save();

    res.status(201).json({
      status: "success",
      data: { event },
    });
  });

exports.InviteOne = (EventModal, UserModal) =>
  catchAsync(async (req, res, next) => {
    const user = await isUser(req, next);
    const { email, id } = req.body;

    if (!user) {
      return next(new appError("User not found", 404));
    }

    if (!id) {
      return next(new appError("Event id must be provided", 400));
    }

    if (!email) {
      return next(new appError("Email must be provided", 400));
    }

    const invitedUser = await UserModal.findOne({ email });
    if (!invitedUser) {
      return next(new appError("No such user found", 404));
    }

    const currentEvent = await EventModal.findById(id);
    if (!currentEvent) {
      return next(new appError("No such event found", 404));
    }

    if (invitedUser.joinedEvents.includes(id)) {
      return next(new appError("User already invited to this event", 400));
    }

    invitedUser.joinedEvents.push(id);
    await invitedUser.save();

    res.status(201).json({
      status: "success",
      data: invitedUser,
    });
  });

exports.VoteOne = (EventModal, UserModal) =>
  catchAsync(async (req, res, next) => {
    const user = await isUser(req, next);
    const { eventId, contentIndex } = req.body;

    if (!user) {
      return next(new appError("User not found", 404));
    }

    if (eventId == null || contentIndex == null) {
      return next(
        new appError("Event ID and content index must be provided", 400)
      );
    }

    const currentEvent = await EventModal.findById(eventId);
    if (!currentEvent) {
      return next(new appError("No such event found", 404));
    }

    if (user.joinedEvents.includes(eventId)) {
      return next(new appError("User has already voted for this event", 400));
    }

    if (contentIndex < 0 || contentIndex >= currentEvent.eventContent.length) {
      return next(new appError("Invalid content index", 400));
    }

    currentEvent.eventContent[contentIndex].joinedUser.push(user._id);
    await currentEvent.save();

    user.joinedEvents.push(eventId);
    await user.save();

    res.status(201).json({
      status: "success",
      data: { event: currentEvent },
    });
  });
