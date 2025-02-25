const authController = require("../controllers/authController.js");
const eventController = require("../controllers/eventController.js");
const express = require("express");
const router = express.Router();

router.use(authController.protectedByToken);

router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEvent);

router.put("/:id", eventController.updateEvent);
router.get("/:id", eventController.getOne);

module.exports = router;
