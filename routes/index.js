const express = require("express");
const router = express.Router();
const { fetchContestList, fetchContest, getUserDetails, problem } = require('../api_helpers/api');
const { decrypt } = require('../api_helpers/cryptoHelper');
const { getNewAccessToken } = require('../api_helpers/token');

const checkAccessToken = async (req, res, next) => {

    req.cookies = JSON.parse(JSON.stringify(req.cookies));

    if (req.cookies.hasOwnProperty("accessToken")) {
        next();
    } else {
        console.log("\x1b[35mGENERATING NEW ACCESS TOKEN\x1b[0m");
        try{
            const done = await getNewAccessToken(`${decrypt(req.cookies['refreshToken'])}`);
            console.log("\x1b[35mGENERATED NEW ACCESS TOKEN\x1b[0m");
            res.cookie("accessToken", done.encryptedAccessToken, {maxAge: 1000 * 60 * 15, }); //resets accessToken in 30mins
            res.cookie("refreshToken", done.encryptedRefreshToken);
            next();
        }catch(e){
            console.log("\x1b[35mFAILED TO GENERATE NEW ACCESS TOKEN\x1b[0m");
            res.redirect("/authFailed");
        }
    }
};

router.get("/", (req, res) => {
    const data = {
        client_id: process.env.CLIENT_ID,
        redirectURI: process.env.REDIRECT_URI,
    };

    req.cookies = JSON.parse(JSON.stringify(req.cookies));
    if (req.cookies.hasOwnProperty("username")){
        res.render("dashboard");
    } else {
        res.render("index", data);
    }
});

router.get("/dashboard", checkAccessToken, (req, res) => {
    res.render("dashboard");
});

router.get("/authFailed", (req, res) => {
    res.render("failed");
});

router.get("/contestlist",checkAccessToken, (req, res) => {
    res.render("contestList");
});

router.get("/getContestList", checkAccessToken, async (req, res) => {
    // get contest list API call
    let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let list = await fetchContestList(options);
    const userDetails = await getUserDetails(options);
    const attemptedContest = userDetails.problemStats.attempted;
    res.json({ contestList: list, attemptedContest: attemptedContest });
});

router.get("/contestPage/:contestID", checkAccessToken, async (req, res) => {
    // contest landing page handler.
    let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let details = await fetchContest(req.params.contestID, options);
    
    let s = `${details['announcements']}`;
    s = s.replace(/&lt;/gi,'<');
    s = s.replace(/&gt;/gi,'>');
    details['announcements'] = s;

    res.render('contestPage', details);
});

router.get("/contestPage/:contestID/problem/:problemCode", checkAccessToken, async (req, res) => {
    // problem page handler
    let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let problemDetails = await problem(req.params.contestID, req.params.problemCode, options);
    
    let data = `${problemDetails.body}`;
    data = data.replace(/<br\s*\/?>/gi, '\n');
    
    res.render('problemPage', { problemName: problemDetails.problemName, body: data });
});

module.exports = router;
