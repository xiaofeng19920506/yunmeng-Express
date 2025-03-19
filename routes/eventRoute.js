const authController = require("../controllers/authController.js");
const eventController = require("../controllers/eventController.js");
const express = require("express");
const router = express.Router();

router.use(authController.protectedByToken);

router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEvent);

router.post("/invite", eventController.inviteUser);

router.put("/:id", eventController.updateEvent);
router.get("/:id", eventController.getOne);
router.delete("/:id", eventController.deleteOne);
router.post("/:id", eventController.voteOne);

module.exports = router;
