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
    const path = `https://api.codechef.com/contests/${contestCode}?fields=code,name,startDate,endDate,type,announcements,problemsList`;
    const response = await makeGETRequest(path, options);
    return response.content;
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

const getUserDetails = async (options) => {
    const path = `https://api.codechef.com/users/me`;
    const response = await makeGETRequest(path, options);
    return response.content;
}

module.exports = {getUserDetails,fetchContestList,fetchContest,problem};