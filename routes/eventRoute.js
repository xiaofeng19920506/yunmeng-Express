const express = require("express");
const authController = require("../controllers/authController.js");
const eventController = require("../controllers/eventController.js");

const router = express.Router();

router.use(authController.protectedByToken);
router
  .route("/")
  .post(eventController.createBooking)
  .get(eventController.getAllBooking);

router.route("/:id").put(eventController.updateBooking);

module.exports = router;
