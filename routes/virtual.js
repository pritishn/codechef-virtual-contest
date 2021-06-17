const express = require("express");
const router = express.Router();
const { fetchContestDuration, fetchContest, fetchProblemDetails } = require("../api_helpers/api");
const { decrypt } = require("../api_helpers/cryptoHelper");
const { checkAccessToken } = require("../api_helpers/token");
const { prepareRanklist } = require("../api_helpers/scraper");
const { VirtualContest } = require("../models/Models");

// routes related to virutal contest

/* helpers */
const doesVirtualExist = async (username, contestCode) => {
    const found = await VirtualContest.findOne({
        username: username,
        contestCode: contestCode,
    }).exec();
    console.log(username, contestCode);
    if (found == null) {
        return 0;
    } else {
        if (found.isRunning == true) {
            return 1;
        } else return 2;
    }
};
const noVirtualRunning = async (username) => {
    const found = await VirtualContest.findOne({
        username: username,
        isRunning: true,
    }).exec();
    console.log(found);
    if (found == null) return true;
    else return false;
};
/* ---- */

router.get("/setupVirtual/:contestCode", checkAccessToken, async (req, res) => {
    const username = req.cookies["username"];
    let ok = await noVirtualRunning(username);
    if (ok == true) {
        res.render("setupVirtual", { contestCode: req.params.contestCode });
    } else {
        res.status(400).send("Virtual Contest Running Already");
    }
});

router.get("/registerVC", checkAccessToken, async (req, res) => {
    const contestCode = req.query.code;
    const username = req.cookies["username"];
    let ok = await noVirtualRunning(username);
    if (ok == true) {
        try {
            try {
                let options = {
                    Authorization: "Bearer " + decrypt(req.cookies["accessToken"]),
                };
                var [len, realStartTime] = await fetchContestDuration(contestCode, options);
            } catch (err) {
                res.status(500).send("Error in fetching contest duration");
            }
            let cur = Date.now();
            let end = cur + len;
            const newContest = new VirtualContest({
                username: req.cookies["username"],
                isRunning: true,
                realStartTime: realStartTime,
                startTime: cur,
                endTime: end,
                contestCode: contestCode,
                problemsAttempted: [],
            });

            await newContest.save();
            res.redirect(`/virtual/${contestCode}`);
        } catch (err) {
            res.status(500).send("Error in creating virtual contest");
        }
    } else {
        res.status(400).send("Virtual Contest Running Already");
    }
});

router.get("/virtual/endVC", checkAccessToken, async (req, res) => {

    const contestCode = req.query.code;
    const username = req.cookies["username"];

    const found = await VirtualContest.findOne({
        username: username,
        contestCode: contestCode,
    }).exec();

    if (found == null) {
        res.status(400).send("This virtual contest does not exist.");
    } else {
        await VirtualContest.findOneAndUpdate({ username: username, contestCode: contestCode, isRunning: true }, { isRunning: false });
        res.redirect(`/virtual/${contestCode}`);
    }
});


router.get("/virtual/fetchRanklist/:contestCode", checkAccessToken, async (req, res) => {
    const username = req.cookies["username"];
    const contestCode = req.params.contestCode;
    const state = await doesVirtualExist(username, contestCode);

    if (state == 0) {
        // case 0 : virtual contest for this user and contestCode doesnt exist.
        // Display Error Page (No such virtual contest exists for username).
        res.status(400).send("This virtual contest doesn't exist for current user.");
    } else {
        // case 1 : contest exists
        let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };

        const data = await prepareRanklist(contestCode, options);
        res.send(data);
    }
});


router.get(
    "/virtual/:contestCode/ranklist",
    checkAccessToken,
    async (req, res) => {

        const username = req.cookies["username"];
        const contestCode = req.params.contestCode;
        const state = await doesVirtualExist(username, contestCode);
        console.log("Virtual state : " + state);
        if (state == 0) {
            // case 0 : virtual contest for this user and contestCode doesnt exist.
            // Display Error Page (No such virtual contest exists for username).
            res.status(400).send("This virtual contest doesn't exist for current user.");
        } else {
            // case 1 : contest exists
            const vc = await VirtualContest.findOne({
                username: username,
                contestCode: contestCode,
            }).exec();

            let details = {
                realStartTime: vc.realStartTime,
                isRunning: vc.isRunning,
                startTime: vc.startTime,
                endTime: vc.endTime,
                contestCode: contestCode
            };
            console.log(details);
            res.render("virtualRanklist", details);
        }
    }
);

router.get("/virtual/:contestCode", checkAccessToken, async (req, res) => {
    const username = req.cookies["username"];
    const contestCode = req.params.contestCode;
    const state = await doesVirtualExist(username, contestCode);
    console.log(state);
    if (state == 0) {
        // case 0 : virtual contest for this user and contestCode doesnt exist.
        // Display Error Page (No such virtual contest exists for username).
        res.status(400).send("This virtual contest doesn't exist for current user.");
    } else {
        // case 1 : start time is less than current time and within contest duration.
        // Display Dashboard with problems links.
        const vc = await VirtualContest.findOne({
            username: username,
            contestCode: contestCode,
        }).exec();

        let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
        let details = await fetchContest(contestCode, options);
        details['isRunning'] = vc.isRunning;
        details['endTime'] = vc.endTime;

        res.render("virtualDashboard", details);
    }
});



router.get(
    "/virtual/:contestCode/:problemCode",
    checkAccessToken,
    async (req, res) => {

        const username = req.cookies["username"];
        const contestCode = req.params.contestCode;
        const state = await doesVirtualExist(username, contestCode);
        console.log("Virtual state : " + state);
        if (state == 0) {
            // case 0 : virtual contest for this user and contestCode doesnt exist.
            // Display Error Page (No such virtual contest exists for username).
            res.status(400).send("This virtual contest doesn't exist for current user.");
        } else {
            // case 1 : start time is less than current time and within contest duration.
            // Display Dashboard with problems links.
            const vc = await VirtualContest.findOne({
                username: username,
                contestCode: contestCode,
            }).exec();

            let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
            let details = await fetchProblemDetails(contestCode, req.params.problemCode, options);
            details['isRunning'] = vc.isRunning;
            details['endTime'] = vc.endTime;
            details['contestCode'] = contestCode;
            console.log(details);
            res.render("virtualProblemPage", details);
        }
    }
);


module.exports = router;
