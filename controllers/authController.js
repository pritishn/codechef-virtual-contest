"use strict";
const { initiateAuthorization } = require('../api_helpers/token');
const { decrypt } = require('../api_helpers/cryptoHelper');
const { getNewAccessToken } = require('../api_helpers/token');

/* root,  auth_done, logout, dashboard , auth_failed */

const root = async (req, res) => {
    const data = {
        client_id: process.env.CLIENT_ID,
        redirectURI: process.env.REDIRECT_URI,
    };
    if (req.cookies.hasOwnProperty("accessToken")) {
        res.redirect('/dashboard');
    } else {
        try {
            const done = await getNewAccessToken(`${decrypt(req.cookies['refreshToken'])}`);
            res.cookie("accessToken", done.encryptedAccessToken, { maxAge: 1000 * 60 * 30 });
            res.cookie("refreshToken", done.encryptedRefreshToken);
            res.redirect('/dashboard');
        } catch (e) {
            res.render("index", data);
        }
    }
};

const logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("username");
    res.redirect('/');
};

const auth_done = async (req, res) => {
    let authCode = req.query.code, state = req.query.state;
    let done = await initiateAuthorization(authCode, state);
    if (done) {
        res.cookie('username', done.userDetails.username);
        res.cookie('accessToken', done.encryptedAccessToken, { maxAge: 1000 * 60 * 30 });
        res.cookie('refreshToken', done.encryptedRefreshToken);
        res.redirect('/dashboard');
    } else {
        res.redirect('/authFailed');
    }
};

const auth_failed = (req, res) => { res.render("errors/authFailed"); };

const dashboard = (req, res) => { res.render("dashboard"); };


module.exports = {
    root,
    logout,
    auth_done,
    auth_failed,
    dashboard
};