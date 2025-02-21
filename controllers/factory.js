const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "Authentication token is required",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next(new appError("Invalid token", 401));
    }
    console.log({ decoded });
    const id = decoded.userId;
    const user = await Model.findOne({ _id: id });
    console.log(user);
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

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const event = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return next(new appError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: event,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const event = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: event,
    });
  });
