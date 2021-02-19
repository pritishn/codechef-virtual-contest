const https = require('https');
const request = require('request');
const User = require("../models/User")
let global_access_token,global_refresh_token,scope;
const initiateAuthorization = async (authCode , state ) => {
    let oauth_details = await exchangeAuthCodeForToken(authCode,state);
    if(oauth_details){
        global_access_token = oauth_details.access_token;
        global_refresh_token = oauth_details.refresh_token;
        scope = oauth_details.scope;
        console.log("Fetched access token successfully!");
        return true;
    }else return false;
}


const exchangeAuthCodeForToken = async (authCode,state) =>{
    let options ={
        'Content-Type': 'application/json',
        'grant_type': "authorization_code",
        'code': authCode,
        'client_id': process.env.CLIENT_ID,
        'client_secret':process.env.CLIENT_SECRET,
        'redirect_uri': process.env.REDIRECT_URI
    };

    return new Promise((resolve,reject)=>{ 
        request({
            url: "https://api.codechef.com/oauth/token",
            method: "POST",
            json: true, 
            body: options
        }, (error, response, body) =>{
            if(error){
                reject(error);
            }else{
                resolve(body.result.data);
            }
        });
    });
}

module.exports = {initiateAuthorization , global_access_token , global_refresh_token , scope};