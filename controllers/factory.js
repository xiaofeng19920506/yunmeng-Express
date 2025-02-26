const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const extractToken = (request) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  return token;
};

const extractUserIdFromToken = (token, next) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user.userId;
  } catch (error) {
    return next(new appError("Invalid token", 401));
  }
};

exports.getOne = (userModal, eventModal) => {
  return catchAsync(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "Authentication token is required",
      });
    }

    const id = extractUserIdFromToken(token, next);
    const user = await userModal.findOne({ _id: id });

    if (!user) {
      return next(new appError("No user found with that username", 404));
    }

    const userEvent = user.holdEvents.find(
      (event) => event._id.toString() === req.params.eventId
    );

    if (!userEvent) {
      return next(new appError("User doesn't have this event holded", 404));
    }

    const event = await eventModal.findOne(userEvent._id);
    if (!event) {
      return next(new appError("Event not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        event,
      },
    });
  });
};

exports.getAll = (userModal, eventModal) => {
  return catchAsync(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "Authentication token is required",
      });
    }

    const id = extractUserIdFromToken(token, next);
    const user = await userModal.findOne({ _id: id });

    if (!user) {
      return next(new appError("No user found with that username", 404));
    }

    const holdEvents = await Promise.all(
      user.holdEvents.map(async (eventId) => {
        try {
          const event = await eventModal.findOne({ _id: eventId });
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

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const deletedEvent = await Model.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return next(new appError("No event found with that id", 404));
    }

    res.status(204).json({ status: "success", data: null });
  });
};

exports.updateOne = (userModal, eventModal) =>
  catchAsync(async (req, res, next) => {
    // const event = await Model.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // if (!event) {
    //   return next(new appError("No document found with that ID", 404));
    // }

    res.status(200).json({
      status: "success",
      data: event,
    });
  });

exports.createOne = (userModal, eventModal) =>
  catchAsync(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "Authentication token is required",
      });
    }

    const id = extractUserIdFromToken(token, next);
    const user = await userModal.findOne({ _id: id });

    if (!user) {
      return next(new appError("No user found with that username", 404));
    }

    const event = await eventModal.create(req.body);
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
