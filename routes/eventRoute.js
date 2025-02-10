const express = require("express");
const authController = require("../controllers/authController.js");
const bookingController = require("../controllers/bookingController.js");

const router = express.Router();

router.use(authController.protectedByToken);
router
  .route("/")
  .post(bookingController.createBooking)
  .get(bookingController.getAllBooking);

router.route("/:id").put(bookingController.updateBooking);

module.exports = router;