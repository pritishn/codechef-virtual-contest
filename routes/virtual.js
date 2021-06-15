const express = require("express");
const router = express.Router();
const { fetchContestDuration } = require("../api_helpers/api");
const { decrypt } = require("../api_helpers/cryptoHelper");
const { checkAccessToken } = require("../api_helpers/token");
const { VirtualContest } = require("../models/Models");

// routes related to virutal contest

/* helpers */
const doesVirtualExist = async (username, contestCode) => {

    const found = await VirtualContest.findOne({
        username: username,
        contestCode: contestCode
    }).exec();

    if (found == null) {
        return 0;
    } else {
        console.log(found);
        if (found.isRunning == true) {
            return 1;
        } else return 2;
    }
};
const noVirtualRunning = async (username) => {
    console.log("checking");
    const found = await VirtualContest.findOne({
        username: username,
        isRunning: true
    }).exec();
    console.log(found);
    if (found == null)
        return true;
    else return false;

};
/* ----*/

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
                let options = { 'Authorization': 'Bearer ' + decrypt(req.cookies['accessToken']) };
                var len = await fetchContestDuration(contestCode, options);
            } catch (err) {
                res.status(500).send("Error in fetching contest duration");
            }
            let cur = (Date.now());
            let end = cur + len;
            const newContest = new VirtualContest({
                username: req.cookies["username"],
                isRunning: true,
                startTime: cur,
                endTime: end,
                contestCode: contestCode,
                problemsAttempted: []
            });
            
            console.log(newContest);
            await newContest.save();
            res.redirect(`/virtual/${contestCode}`);
        } catch (err) {
            console.log(err);
            res.status(500).send("Error in creating virtual contest");
        }
    } else {
        res.status(400).send("Virtual Contest Running Already");
    }
});
router.get("/virtual/:contestCode", checkAccessToken, async (req, res) => {

    const username = req.cookies["username"];
    const contestCode = req.params.contestCode;
    const state = await doesVirtualExist(username, contestCode);
    console.log(state);
    if (state == 0) {
        /* 
            case 0 : virtual contest for this user and contestCode doesnt exist.
            Display Error Page (No such virtual contest exists for username).
        */
        res.status(400).send("This virtual contest doesn't exist for current user.");
    } else if (state == 1) {
        /* 
            case 1 : start time is less than current time and within contest duration.
            Display Dashboard with problems links.
            Display Ranklist page link.
        */
        res.status(400).send("This virtual contest is running.");

    } else if (state == 2) {
        /* 
        case 3 : Time is up and VC is over. 
        Display Dashboard with final ranklist and user position.
        */
        res.status(400).send("This virtual contest has ended.");
    }
});

router.get(
    "/virtual/:contestCode/:problemCode",
    checkAccessToken,
    (req, res) => {
        // req obj should have start time.
        /* 
            case 0 : virtual contest for this user and contestCode doesnt exist.
            Display Error Page (No such virtual contest exists for username).
        */
        /* 
            case 1 : start time is less than current time and within contest duration.
            Dis play Problem Page with Countdown.
        */
        /* 
            case 2 : start time is greater than current time.
            Display Dashboard with CountDown. (ask user to refresh page when CountDown is over.) 
        */
        /* 
            case 3 : Time is up and VC is over. 
            Display Dashboard with final ranklist and user position.
        */
        res.render("dashboard");
    }
);
// router.get("/startVirtual/:contestCode",checkAccessToken,(req,res)=>{

// });

router.get("virtual/endVc",checkAccessToken, async (req, res) => {
  //check if virtual exist and if it exist delete from schema virtualcontest
  const contestCode = req.query.code;
  const username = req.cookies["username"];
  //render user rank
  //Save the user rank here and render in a seperate page
  const found = await VirtualContest.findOne({
    username: username,
    contestCode: contestCode
  }).exec();
  if(found==null){
    res.status(400).send("This virtual contest does not exist.");
  }else{
  VirtualContest.remove({
    username: username
  }, function (err) {
    if(err) console.log(err);
    console.log("Successful deletion");
  });
  res.render("dashboard");
  }
})


module.exports = router;
