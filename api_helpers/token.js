const request = require('request');
const {getUserDetails} = require('./api');
const { decrypt, encrypt } = require('./cryptoHelper');


/* used to make postRequsts  for tokens */
const postRequest = async (options) => {
    console.log('\x1b[36m%s\x1b[0m', 'POST REQUEST MADE');
    console.log(options);
    return new Promise((resolve, reject) => {
        request({
            url: "https://api.codechef.com/oauth/token",
            method: "POST",
            json: true,
            body: options
        }, (error, response, body) => {
            if (body.status == 'error') {
                console.log("\x1b[31mERROR in POST request\x1b[0m",body.result.errors);
                reject(body.result);
            } else {
                console.log('\x1b[36m%s\x1b[0m', 'POST REQUEST SUCCESSFUL',body.result);
                resolve(body.result.data);
            }
        });
    });
}

/* used to get initial authorization data on login */
const initiateAuthorization = async (authCode, state) => {

    let options = {
        'Content-Type': 'application/json',
        'grant_type': "authorization_code",
        'code': authCode,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'redirect_uri': process.env.REDIRECT_URI
    };

    let oauth_details = await postRequest(options);
    
    if (oauth_details) {
        options = { 'Authorization': 'Bearer ' + oauth_details.access_token };

        const encryptedAccessToken = encrypt(oauth_details.access_token);
        const encryptedRefreshToken = encrypt(oauth_details.refresh_token);

        const userDetails = await getUserDetails(options);
    
        return { userDetails, encryptedAccessToken, encryptedRefreshToken };
    } else return null;
}


/* used to get new access token from old refresh token */
const getNewAccessToken = async (refresh_token) => {

    let options = {
        'Content-Type': 'application/json',
        'grant_type': "refresh_token",
        'refresh_token': `${refresh_token}`,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET
    };

    try {
        let oauth_details = await postRequest(options);
        const encryptedAccessToken = encrypt(oauth_details.access_token);
        const encryptedRefreshToken = encrypt(oauth_details.refresh_token);
        return new Promise (resolve => resolve({ encryptedAccessToken, encryptedRefreshToken }));
    }catch(e){
        return new Promise ((resolve,reject) => reject({ encryptedAccessToken, encryptedRefreshToken }));
    }
}

module.exports = { initiateAuthorization, getNewAccessToken };