"use strict";
const { fetchContestList, fetchContest, getUserDetails, fetchProblemDetails } = require('../api_helpers/api');
const { decrypt } = require('../api_helpers/cryptoHelper');

// finding contest related routes
const contest_list = (req, res) => { res.render("navigation/contestList"); };

const get_contest_list = async (req, res) => {
    let oauth_header = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let list = await fetchContestList(oauth_header);
    const userDetails = await getUserDetails(oauth_header);
    const attemptedContest = userDetails.problemStats.attempted;
    res.json({ contestList: list, attemptedContest: attemptedContest });
};

const contest_contestpage = async (req, res) => {
    let oauth_header = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let details = await fetchContest(req.params.contestCode, oauth_header);
    res.render('navigation/contestPage', details);
};

const contest_problempage = async (req, res) => {
    let oauth_header = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let problemDetails = await fetchProblemDetails(req.params.contestCode, req.params.problemCode, oauth_header);
    res.render('navigation/problemPage', problemDetails);
};

const contest_ranklist = async (req, res) => { 
    res.status(301).redirect(`https://www.codechef.com/rankings/${req.params.contestCode}`);
};

module.exports ={
    contest_list,
    get_contest_list,
    contest_contestpage,
    contest_problempage,
    contest_ranklist
};
