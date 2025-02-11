const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/verifyToken", authController.verifyToken);
router.post("/signup", authController.signup);

module.exports = router;
