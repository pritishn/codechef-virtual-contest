"use strict";
const express = require("express");
const router = express.Router();
const { checkAccessToken } = require("../api_helpers/token");
const indexController = require("../controllers/indexController");


// finding-contest related routes
router.get("/contestList", checkAccessToken, indexController.contest_list);
router.get("/getContestList", checkAccessToken, indexController.get_contest_list);
router.get("/contestPage/:contestCode", checkAccessToken, indexController.contest_contestpage);
router.get("/contestPage/:contestCode/problem/:problemCode", checkAccessToken, indexController.contest_problempage);
router.get("/contestPage/:contestCode/ranklist", checkAccessToken, indexController.contest_ranklist);

module.exports = router;
