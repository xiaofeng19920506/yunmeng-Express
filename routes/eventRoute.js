const express = require("express");
const authController = require("../controllers/authController.js");
const eventController = require("../controllers/eventController.js");

const router = express.Router();

router.use(authController.protectedByToken);
router
  .route("/")
  .post(eventController.createEvent)
  .get(eventController.getAllEvent);

router.route("/:id").put(eventController.updateEvent);

module.exports = router;
