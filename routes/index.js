const express = require("express");
const router = express.Router();
const { fetchContestList, fetchContest, getUserDetails, fetchProblemDetails, ranklist } = require('../api_helpers/api');
const { decrypt } = require('../api_helpers/cryptoHelper');
const { checkAccessToken } = require('../api_helpers/token');

// finding contest related routes

router.get("/contestList",checkAccessToken, (req, res) => {
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
    res.render('contestPage', details);
});

router.get("/contestPage/:contestID/problem/:problemCode", checkAccessToken, async (req, res) => {
    // problem page handler
    let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let problemDetails = await fetchProblemDetails(req.params.contestID, req.params.problemCode, options);
    res.render('problemPage', problemDetails);
});

router.get("/contestPage/:contestID/ranklist",checkAccessToken,async (req,res)=>{
    let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    // let ranklist1 = await ranklist(req.params.contestID,options);
    // res.render('rankPage',{ ranklist:ranklist1});
    res.status(301).redirect(`https://www.codechef.com/rankings/${req.params.contestID}`);
});

module.exports = router;
