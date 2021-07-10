const request = require('request');

const makeGETRequest = async (path, oauth_header) => {
    //let oauth_header ={'Authorization': 'Bearer '+ access_token };
    console.log('\x1b[36m%s\x1b[0m', 'GET REQUEST MADE');
    console.log(path);

    return new Promise((resolve, reject) => {
        request({ url: path, method: "GET", json: true, headers: oauth_header}, (error, response, body) => {
            if (error) {
                console.log("\x1b[31mERROR in GET request\x1b[0m",error);
                reject(error);
            } else {
                resolve(body.result.data);
            }
        });
    });
}

const fetchContest = async (contestCode, oauth_header) => {
    const path = `https://api.codechef.com/contests/${contestCode}`;
    const res = await makeGETRequest(path, oauth_header);
    let s = res.content.announcements;
    s = s.replace(/&lt;/gi,'<');
    s = s.replace(/&gt;/gi,'>');
    res.content.announcements = s;
    return res.content;
}

const ParseDate = (d) => {
    let nd = d.substring(0,10)+"T"+d.substring(11);
    let date = new Date(nd);
    return date.getTime();
}
const fetchContestDuration = async (contestCode, oauth_header) => {
    const path = `https://api.codechef.com/contests/${contestCode}/?fields=startDate%2CendDate`;
    const response = await makeGETRequest(path, oauth_header);
    return [ParseDate(response.content.endDate)-ParseDate(response.content.startDate),response.content.startDate];
}

const fetchContestList = async (oauth_header) => {
    const path = `https://api.codechef.com/contests?fields=code,name,startDate,endDate&status=past`;
    const response = await makeGETRequest(path, oauth_header);
    return response.content.contestList;
}

const fetchProblemDetails = async (contestCode,problemCode,oauth_header)=>{
    const path = `https://api.codechef.com/contests/${contestCode}/problems/${problemCode}?fields=`;
    const response = await makeGETRequest(path, oauth_header);
    console.log(response);
    response.content.body = response.content.body.replace(/<br\s*\/?>/gi, '\n'); 
    return response.content;
}

const fetchRanklist = async(contestCode,offset,oauth_header)=>{
    console.log("trying to get ", offset);
    const path = `https://api.codechef.com/rankings/${contestCode}?offset=${offset}`;
    const response = await makeGETRequest(path, oauth_header);
    return response.content;
}

const getUserDetails = async (oauth_header) => {
    const path = `https://api.codechef.com/users/me`;
    const response = await makeGETRequest(path, oauth_header);
    return response.content;
}
module.exports = {fetchContestDuration,getUserDetails,fetchContestList,fetchContest,fetchProblemDetails,fetchRanklist};