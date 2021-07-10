"use strict";
const express = require("express");
const router = express.Router();
const { checkAccessToken } = require("../api_helpers/token");
const virtualController = require("../controllers/virtualController");

// routes related to virutal contest

router.get("/setupVirtual/:contestCode", checkAccessToken, virtualController.virtual_setup_virtual);
router.get("/registerVC", checkAccessToken, virtualController.virtual_register_vc);
router.get("/virtual/endVC", checkAccessToken, virtualController.virtual_end_vc);
router.get("/virtual/fetchRanklist/:contestCode", checkAccessToken, virtualController.virtual_fetch_ranklist);
router.get("/virtual/:contestCode/ranklist", checkAccessToken, virtualController.virtual_ranklist_page);
router.get("/virtual/:contestCode", checkAccessToken, virtualController.virtual_contest_page);
router.get("/virtual/:contestCode/:problemCode", checkAccessToken, virtualController.virtual_problem_page);

module.exports = router;
