const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

exports.getAll = (Model) => {
  catchAsync(async (req, res, next) => {
    const { eventOwner } = Model.eventOwner;
    const events = await Model.find(Model.eventOwner === eventOwner);

    res.status(200).json({
      status: "success",
      result: events.length,
      data: events,
    });
  });
};

exports.deleteOne = (Model) => {
  catchAsync(async (req, res, next) => {
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
