const https = require('https');
const request = require('request');
const { options } = require('../routes/auth');
const {global_acccess_token,global_refresh_token} = require('./token');


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

// get contest details helper

const fetchContests = async (contestCode , options ) => {

    //"https://api.codechef.com/contests/{contestCode}?fields=&sortBy=&sortOrder="

    const path = `https://api.codechef.com/contests/${contestCode}?fields=code,name,startDate,endDate,type,announcements,problemsList`;

    const response = await GET_requests(path,options);

    return response.data.content[0];
}

const fetchContestList = async (options) => {

    //"https://api.codechef.com/contests/{contestCode}?fields=&sortBy=&sortOrder="

    const path = `https://api.codechef.com/contests?fields=code,name,startDate,endDate&status=past`;

    const response = await GET_requests(path,options);

    return response.data.content.contestList;
}

