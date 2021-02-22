const express = require("express");
const router = express.Router();

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

module.exports = router;
