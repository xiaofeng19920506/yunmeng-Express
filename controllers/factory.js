const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const extractToken = (request) => {
  const authHeader = req.headers["authorization"];
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

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "Authentication token is required",
      });
    }

    const id = extractUserIdFromToken(token, next);
    const user = await Model.findOne({ _id: id });

    if (!user) {
      return next(new appError("No user found with that username", 404));
    }

    res.status(200).json({
      status: "success",
      result: user.holdEvents.length,
      data: user.holdEvents,
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

    
    res.status(201).json({
      status: "success",
      data: event,
    });
  });
