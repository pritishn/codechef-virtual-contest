const request = require('request');
const {getUserDetails} = require('./api');
const { decrypt, encrypt } = require('./cryptoHelper');

const initiateAuthorization = async (authCode, state) => {
    let oauth_details = await exchangeAuthCodeForToken(authCode, state);
    if (oauth_details) {
        let options = { 'Authorization': 'Bearer ' + oauth_details.access_token };

        const encryptedAccessToken = encrypt(oauth_details.access_token);
        const encryptedRefreshToken = encrypt(oauth_details.refresh_token);

        const userDetails = await getUserDetails(options);
    
        return { userDetails, encryptedAccessToken, encryptedRefreshToken };
    } else return null;
}


const exchangeAuthCodeForToken = async (authCode, state) => {
    let options = {
        'Content-Type': 'application/json',
        'grant_type': "authorization_code",
        'code': authCode,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'redirect_uri': process.env.REDIRECT_URI
    };

    return new Promise((resolve, reject) => {
        request({
            url: "https://api.codechef.com/oauth/token",
            method: "POST",
            json: true,
            body: options
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body.result.data);
            }
        });
    });
}

const getNewAccessToken = async (refresh_token) => {
    let oauth_details = await exchangeRefreshTokenForAccessToken(refresh_token);
    if (oauth_details) {
        const encryptedAccessToken = encrypt(oauth_details.access_token);
        const encryptedRefreshToken = encrypt(oauth_details.refresh_token);
        return { encryptedAccessToken, encryptedRefreshToken };
    } else return null;
}

const exchangeRefreshTokenForAccessToken = async (refresh_token) => {
    let options = {
        'Content-Type': 'application/json',
        'grant_type': "refresh_token",
        'refresh_token': refresh_token,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET
    };

    return new Promise((resolve, reject) => {
        request({
            url: "https://api.codechef.com/oauth/token",
            method: "POST",
            json: true,
            body: options
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body.result.data);
            }
        });
    });
}


module.exports = { initiateAuthorization, getNewAccessToken };