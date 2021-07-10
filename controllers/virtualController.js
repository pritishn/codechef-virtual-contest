const { fetchContestDuration, fetchContest, fetchProblemDetails } = require("../api_helpers/api");
const { decrypt } = require("../api_helpers/cryptoHelper");
const { prepareRanklist } = require("../api_helpers/scraper");
const { VirtualContest } = require("../models/Models");

/* helpers */
const doesVirtualExist = async (username, contestCode) => {
    /* 
        Returns 1 if username has contestCode running in virtual mode.
        Returns 2 if username had finished virtual contest for contestCode.
        Returns 0 if username never had started this virtual contest.
    */
    const found = await VirtualContest.findOne({
        username: username,
        contestCode: contestCode,
    }).exec();
    if (found == null) {
        return 0;
    } else {
        if (found.endTime >= Date.now()) {
            return 1;
        } else return 2;
    }
};
const noVirtualRunning = async (username) => {
    /* 
        Returns true if username has no virutal running currently otherwise returns false.
    */
    const found = await VirtualContest.findOne({
        username: username,
        endDate: { $gte: Date.now() },
    }).exec();
    if (found == null) return true;
    else return false;
};

const virtual_setup_virtual = async (req, res) => {
    const username = req.cookies["username"];
    let ok = await noVirtualRunning(username);
    if (ok == true) {
        res.render("virtual/setupVirtual", { contestCode: req.params.contestCode });
    } else {
        res.status(400).send("Virtual Contest Running Already");
    }
};


const virtual_register_vc = async (req, res) => {
    const contestCode = req.query.code;
    console.log("casdc", req.cookies);
    const username = req.cookies["username"];
    let ok = await noVirtualRunning(username);
    if (ok == true) {

        let oauth_header = { Authorization: "Bearer " + decrypt(req.cookies["accessToken"]) };
        let [len, realStartTime] = await fetchContestDuration(contestCode, oauth_header);

        let cur = Date.now();
        let end = cur + len;
        const newContest = new VirtualContest({
            username: req.cookies["username"],
            realStartTime: realStartTime,
            startTime: cur,
            endTime: end,
            contestCode: contestCode,
            problemsAttempted: [],
        });

        await newContest.save();
        res.redirect(`/virtual/${contestCode}`);
    } else {
        res.status(400).send("Virtual Contest Running Already");
    }
};


const virtual_end_vc = async (req, res) => {

    const contestCode = req.query.code;
    const username = req.cookies["username"];

    const found = await VirtualContest.findOne({
        username: username,
        contestCode: contestCode,
    }).exec();

    if (found == null) {
        res.status(400).send("This virtual contest does not exist.");
    } else {

        await VirtualContest.findOneAndUpdate({
            username: username,
            contestCode: contestCode,
            endDate: { $gte: Date.now() }
        }, { endDate: Date.now() });

        res.redirect(`/virtual/${contestCode}`);
    }
};

const virtual_fetch_ranklist = async (req, res) => {
    const username = req.cookies["username"];
    const contestCode = req.params.contestCode;
    const state = await doesVirtualExist(username, contestCode);
    if (state == 0) {
        res.status(400).send("This virtual contest doesn't exist for current user.");
    } else {
        let oauth_header = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
        const data = await prepareRanklist(contestCode, oauth_header);
        res.send(data);
    }
};

const virtual_ranklist_page = async (req, res) => {
    const username = req.cookies["username"];
    const contestCode = req.params.contestCode;
    const state = await doesVirtualExist(username, contestCode);
    if (state == 0) {
        res.status(400).send("This virtual contest doesn't exist for current user.");
    } else {
        const { realStartTime, startTime, endTime } =
            await VirtualContest.findOne({ username: username, contestCode: contestCode }).exec();

        let details = {
            realStartTime: realStartTime,
            isRunning: (state == 1 ? true : false),
            startTime: startTime,
            endTime: endTime,
            contestCode: contestCode
        };

        res.render("virtual/virtualRanklist", details);
    }
};

const virtual_contest_page = async (req, res) => {
    const username = req.cookies["username"];
    const contestCode = req.params.contestCode;
    const state = await doesVirtualExist(username, contestCode);

    if (state == 0) {
        res.status(400).send("This virtual contest doesn't exist for current user.");
    } else {
        const { endTime } = await VirtualContest.findOne({
            username: username,
            contestCode: contestCode,
        }).exec();
        let oauth_header = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };

        let details = await fetchContest(contestCode, oauth_header);
        details['isRunning'] = (state == 1 ? true : false);
        details['endTime'] = endTime;

        res.render("virtual/virtualDashboard", details);
    }
};

const virtual_problem_page = async (req, res) => {
    const username = req.cookies["username"];
    const contestCode = req.params.contestCode;
    const state = await doesVirtualExist(username, contestCode);
    if (state == 0) {
        res.status(400).send("This virtual contest doesn't exist for current user.");
    } else {

        const { endTime } = await VirtualContest.findOne({
            username: username,
            contestCode: contestCode
        }).exec();

        let oauth_header = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
        let details = await fetchProblemDetails(contestCode, req.params.problemCode, oauth_header);
        details['isRunning'] = (state == 1 ? true : false);
        details['endTime'] = endTime;
        details['contestCode'] = contestCode;

        res.render("virtual/virtualProblemPage", details);
    }
};

module.exports = {
    virtual_setup_virtual,
    virtual_register_vc,
    virtual_end_vc,
    virtual_fetch_ranklist,
    virtual_ranklist_page,
    virtual_contest_page,
    virtual_problem_page
};
