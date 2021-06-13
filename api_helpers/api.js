const request = require('request');

const makeGETRequest = async (path, options) => {
    //let options ={'Authorization': 'Bearer '+ access_token };
    console.log('\x1b[36m%s\x1b[0m', 'GET REQUEST MADE');
    console.log(path);

    return new Promise((resolve, reject) => {
        request({
            url: path,
            method: "GET",
            json: true,
            headers: options
        }, (error, response, body) => {
            console.log(body)
            if (error) {
                console.log("\x1b[31mERROR in GET request\x1b[0m",error);
                reject(error);
            } else {
                resolve(body.result.data);
            }
        });
    });
}

const fetchContest = async (contestCode, options) => {
    const path = `https://api.codechef.com/contests/${contestCode}`;
    const response = await makeGETRequest(path, options);
    return response.content;
}

const ParseDate  = (d) => {
   
    let nd = d.substring(0,10)+"T"+d.substring(11);
    let date = new Date(nd);
    return date.getTime();
}
const fetchContestDuration = async (contestCode, options) => {
    const path = `https://api.codechef.com/contests/${contestCode}/?fields=startDate%2CendDate`;
    const response = await makeGETRequest(path, options);
    return ParseDate(response.content.endDate)-ParseDate(response.content.startDate);
}

const fetchContestList = async (options) => {
    //"https://api.codechef.com/contests/{contestCode}?fields=&sortBy=&sortOrder="
    const path = `https://api.codechef.com/contests?fields=code,name,startDate,endDate&status=past`;
    const response = await makeGETRequest(path, options);
    return response.content.contestList;
}

const problem = async (contestCode,problemCode,options)=>{
    const path = `https://api.codechef.com/contests/${contestCode}/problems/${problemCode}?fields=`;
    const response = await makeGETRequest(path, options);
    return response.content;
}

const fetchRanklist = async(contestCode,offset,options)=>{
    const path = `https://api.codechef.com/rankings/${contestCode}?offset=${offset}`;
    const response = await makeGETRequest(path, options);
    return response.content;
}

const getUserDetails = async (options) => {
    const path = `https://api.codechef.com/users/me`;
    const response = await makeGETRequest(path, options);
    return response.content;
}

module.exports = {fetchContestDuration,getUserDetails,fetchContestList,fetchContest,problem,fetchRanklist};