const appError = require("./appError");
const jwt = require("jsonwebtoken");
const userModal = require("../models/userModel");

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

const isOwner = async (request, next) => {
  const token = extractToken(request);
  if (!token) {
    return res.status(400).json({
      status: "fail",
      message: "Authentication token is required",
    });
  }

  const id = extractUserIdFromToken(token, next);

  if (!id) {
    return next(new appError("Invalid or expired token", 401));
  }

  const user = await userModal.findOne({ _id: id });
  if (!user) {
    return next(new appError("No user found with that ID", 404));
  }

  return user;
};

module.exports = { isOwner };
