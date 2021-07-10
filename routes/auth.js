"use strict";
const express = require("express");
const router = express.Router();
const { checkAccessToken } = require("../api_helpers/token");
const authController = require("../controllers/authController");

// auth related routes 
router.get("/", authController.root);
router.get("/authDone", authController.auth_done);
router.get("/authFailed", authController.auth_failed);
router.get("/logout", checkAccessToken, authController.logout);
router.get("/dashboard", checkAccessToken, authController.dashboard);

module.exports = router;