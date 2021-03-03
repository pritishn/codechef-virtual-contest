const request = require('request');

const GET_requests = async (path, options) => {
    //let options ={'Authorization': 'Bearer '+ access_token };
    return new Promise((resolve, reject) => {
        request({
            url: path,
            method: "GET",
            json: true,
            headers: options
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body.result.data);
            }
        });
    });
}

const fetchContest = async (contestCode, options) => {
    const path = `https://api.codechef.com/contests/${contestCode}?fields=code,name,startDate,endDate,type,announcements,problemsList`;
    const response = await GET_requests(path, options);
    return response.content;
}

const fetchContestList = async (options) => {
    //"https://api.codechef.com/contests/{contestCode}?fields=&sortBy=&sortOrder="
    const path = `https://api.codechef.com/contests?fields=code,name,startDate,endDate&status=past`;
    const response = await GET_requests(path, options);
    return response.content.contestList;
}

const problem = async (contestCode,problemCode,options)=>{
    const path = `https://api.codechef.com/contests/${contestCode}/problems/${problemCode}?fields=`;
    const response = await GET_requests(path, options);
    return response.content;
}



const getUserDetails = async (options) => {
    const path = `https://api.codechef.com/users/me`;
    const response = await GET_requests(path, options);
    return response.content;
}

module.exports = {getUserDetails,fetchContestList,fetchContest,problem};