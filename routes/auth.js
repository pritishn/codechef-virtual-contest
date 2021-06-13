const express = require('express');
const router = express.Router();
const {initiateAuthorization} = require('../api_helpers/token');
const { decrypt } = require('../api_helpers/cryptoHelper');
const { getNewAccessToken,checkAccessToken } = require('../api_helpers/token');

// auth related routes 

router.get("/",async (req, res) => {
    const data = {
        client_id: process.env.CLIENT_ID,
        redirectURI: process.env.REDIRECT_URI,
    };

    req.cookies = JSON.parse(JSON.stringify(req.cookies));
    if (req.cookies.hasOwnProperty("accessToken")) {
        res.redirect('/dashboard');
    }else{
        try{
            const done = await getNewAccessToken(`${decrypt(req.cookies['refreshToken'])}`);
            res.cookie("accessToken", done.encryptedAccessToken, {maxAge: 1000 * 60 * 30 }); //resets accessToken in 30mins
            res.cookie("refreshToken", done.encryptedRefreshToken);
            res.redirect('/dashboard');
        }catch(e){
            res.render("index", data);
        }
    }
});


router.get('/authDone', async (req,res)=>{
    let authCode = req.query.code, state = req.query.state;
    let done = await initiateAuthorization(authCode,state);
    if(done){
        res.cookie('username',done.userDetails.username);
        res.cookie('accessToken',done.encryptedAccessToken,{maxAge:1000*60*30}); //resets accessToken in 30mins
        res.cookie('refreshToken',done.encryptedRefreshToken);
        res.redirect('/dashboard');
    }else{
        res.redirect('/authFailed');
    }
});

router.get("/logout",checkAccessToken,async (req,res)=>{
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("username");
    res.redirect('/');
});

router.get("/dashboard", checkAccessToken, (req, res) => {
    res.render("dashboard");
});

router.get("/authFailed", (req, res) => {
    res.render("failed");
});


module.exports = router;