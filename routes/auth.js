const express = require('express');
const https = require('https')
const request = require('request');
const router = express.Router();

router.get('/', (req,res)=>{
    const data = {client_id:process.env.CLIENT_ID, redirectURI:process.env.REDIRECT_URI};

    res.render('index',data);
});


router.get('/authDone', async (req,res)=>{
    let authCode = req.query.code, state = req.query.state;
    let done = await initiateAuthorization(authCode,state);
    if(done){
        res.redirect('/dashboard');
    }else{
        res.redirect('/authFailed');
    }
});


const initiateAuthorization = async (authCode , state ) => {

    let oauth_details = await exchangeAuthCodeForToken(authCode,state);
    if(oauth_details){
        // let problem_code = "SALARY";
        // let contest_code = "PRACTICE";
        // let path = 'https://api.codechef.com/' + 'contests/' + contest_code + '/problems/' + problem_code;

        // let options ={
        //     'Authorization': 'Bearer '+ oauth_details.access_token
        // };
    
        // let data = await GET_requests(path,options);
        // console.log(data);
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

const GET_requests = async (path,options) => {
    
    //passed in options 
    //let options ={
    //     'Authorization': 'Bearer '+ oauth_details.access_token
    //};
    return new Promise((resolve,reject)=>{ 
        request({
            url: path,
            method: "GET",
            json: true, 
            headers: options
        }, (error, response, body) =>{
            if(error){
                reject(error);
            }else{
                resolve(body.result.data);
            }
        });
    });
}

module.exports = router;