const express = require("express");
const router = express.Router();
const {fetchContestList,fetchContest,getUserDetails,problem} = require('../api_helpers/api');
const {decrypt} = require('../api_helpers/cryptoHelper');
const {getNewAccessToken} = require('../api_helpers/token');

const showdown  = require('showdown');
const converter = new showdown.Converter();

const checkAccessToken = async (req, res, next) => {
    if (req.cookies.hasOwnProperty("accessToken")) {
        next();
    } else {
        const done = await getNewAccessToken(req.cookies.refreshToken);
        if (done) {
            res.cookie("accessToken", done.encryptedAccessToken, {
                maxAge: 1000 * 60 * 30,
            }); //resets accessToken in 30mins
            res.cookie("refreshToken", done.encryptedRefreshToken);
        } else res.redirect("/authFailed");
        next();
    }
};

router.get("/", (req, res) => {
    const data = {
        client_id: process.env.CLIENT_ID,
        redirectURI: process.env.REDIRECT_URI,
    };
    res.render("index", data);
});

router.get("/dashboard", checkAccessToken, (req, res) => {
    res.render("dashboard");
});

router.get("/authFailed", (req, res) => {
    res.render("failed");
});

router.get("/contestlist",(req,res)=>{
    res.render("contestList");
});

router.get("/getContestList",checkAccessToken,async (req,res)=>{
    let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let list = await fetchContestList(options);
    const userDetails = await getUserDetails(options);
    const attemptedContest = userDetails.problemStats.attempted;
    res.json({contestList : list, attemptedContest : attemptedContest});
});

router.get("/contestPage/:contestID",checkAccessToken,async (req,res)=>{
    let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let details = await fetchContest(req.params.contestID,options);
    res.render('contestPage',details);
}); 
router.get("/contestPage/:contestID/problem/:problemCode",checkAccessToken,async (req,res)=>{
    let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
    let problemDetails = await problem(req.params.contestID,req.params.problemCode,options);
    let data=`${problemDetails.body}`;
    data = data.replace(/<br\s*\/?>/gi, '\n');
    console.log("data : ",data);
    res.render('problemPage',{problemName : problemDetails.problemName,body:data});
});

module.exports = router;


// {
//     code: 'DGTC2021',
//     name: 'DeCode 2021',
//     startDate: '2021-03-01 21:00:00',
//     endDate: '2021-03-01 23:00:00',
//     announcements: '&lt;p&gt;14:30, 15th October 2017: The exam is extended by 10 minutes.&lt;br /&gt;&lt;b&gt;&lt;br /&gt;The problem weightages are given below in rules section.&lt;/b&gt;&lt;/p&gt;\r\n' +
//       '&lt;p&gt;The content of Recent Activity block from exam page has been made inaccessible. In case if you try to access it, you will get an error stating&nbsp;&lt;b&gt;&quot;You are not allowed to check this contest. Please reload&quot;&lt;/b&gt;. Please ignore the error and continue with your exam.&lt;/p&gt;\r\n' +
//       '&lt;p&gt;14:44, 15th October 2017: Problem accuracy will not be displayed. It has been restricted for this exam.&lt;/p&gt;\r\n' +
//       '&lt;p&gt;Also, the score shown on the exam page is not final. It is subject to change after final verification.&lt;/p&gt;\r\n' +
//       '&lt;p&gt;Additionally, you cannot leave the exam hall before 3:30 pm.&lt;/p&gt;',
//     problemsList: [
//       {
//         viewStart: '2021-03-01 21:00:00',
//         submitStart: '2021-03-01 21:00:00',
//         visibleStart: '2021-03-01 23:00:00',
//         end: '2021-03-01 23:00:00',
//         problemCode: 'STUDCOMP',
//         contestCode: 'DGTC2021',
//         successfulSubmissions: 170,
//         accuracy: 32.89719626168225
//       },
//       {
//         viewStart: '2021-03-01 21:00:00',
//         submitStart: '2021-03-01 21:00:00',
//         visibleStart: '2021-03-01 23:00:00',
//         end: '2021-03-01 23:00:00',
//         problemCode: 'PRINSEC',
//         contestCode: 'DGTC2021',
//         successfulSubmissions: 263,
//         accuracy: 29.74472807991121
//       },
//       {
//         viewStart: '2021-03-01 21:00:00',
//         submitStart: '2021-03-01 21:00:00',
//         visibleStart: '2021-03-01 23:00:00',
//         end: '2021-03-01 23:00:00',
//         problemCode: 'MAXWND',
//         contestCode: 'DGTC2021',
//         successfulSubmissions: 10,
//         accuracy: 23.809523809523807
//       },
//       {
//         viewStart: '2021-03-01 21:00:00',
//         submitStart: '2021-03-01 21:00:00',
//         visibleStart: '2021-03-01 23:00:00',
//         end: '2021-03-01 23:00:00',
//         problemCode: 'BUGINDP',
//         contestCode: 'DGTC2021',
//         successfulSubmissions: 14,
//         accuracy: 18.181818181818183
//       },
//       {
//         viewStart: '2021-03-01 21:00:00',
//         submitStart: '2021-03-01 21:00:00',
//         visibleStart: '2021-03-01 23:00:00',
//         end: '2021-03-01 23:00:00',
//         problemCode: 'ENCCIRC',
//         contestCode: 'DGTC2021',
//         successfulSubmissions: 65,
//         accuracy: 26.171875
//       },
//       {
//         viewStart: '2021-03-01 21:00:00',
//         submitStart: '2021-03-01 21:00:00',
//         visibleStart: '2021-03-01 23:00:00',
//         end: '2021-03-01 23:00:00',
//         problemCode: 'VINMAZE',
//         contestCode: 'DGTC2021',
//         successfulSubmissions: 24,
//         accuracy: 32.95454545454545
//       },
//       {
//         viewStart: '2021-03-01 21:00:00',
//         submitStart: '2021-03-01 21:00:00',
//         visibleStart: '2021-03-01 23:00:00',
//         end: '2021-03-01 23:00:00',
//         problemCode: 'PROJOVER',
//         contestCode: 'DGTC2021',
//         successfulSubmissions: 98,
//         accuracy: 36.17021276595745
//       },
//       {
//         viewStart: '2021-03-01 21:00:00',
//         submitStart: '2021-03-01 21:00:00',
//         visibleStart: '2021-03-01 23:00:00',
//         end: '2021-03-01 23:00:00',
//         problemCode: 'AVGNUMBS',
//         contestCode: 'DGTC2021',
//         successfulSubmissions: 303,
//         accuracy: 15.396113602391628
//       }
//     ]
//   }