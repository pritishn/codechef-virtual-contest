const { fetchContest, fetchRanklist } = require('../api_helpers/api');
const { Contest, Ranklist} = require("../models/Models");

const prepareRanklist = async (contestCode,options) =>{
    let offset = 0;
    let ranklist = await Ranklist.findOne({
        contestCode:contestCode
    }).exec();

    if(ranklist != null ) return ranklist; 
    ranklist = {contestCode : contestCode,ranks:[]};
    while(offset <= 3000){
        let ranks = await fetchRanklist(contestCode,offset,options);
        if(ranks == null) break;
        for (let i = 0; i < ranks.length; i++) {
            let element = {
                rank : ranks[i].rank,
                username :ranks[i].username,
                penalty : ranks[i].penalty,
                totalScore : ranks[i].totalScore,
                problemScore : ranks[i].problemScore
            };
            ranklist.ranks.push(element);
        }
        offset+=1500;
    }
    let newRanklist = new Ranklist(ranklist);
    await newRanklist.save();
    return ranklist;
};
const ParseDate  = (d) => {
    let nd = d.substring(0,10)+"T"+d.substring(11);
    let date = new Date(nd);
    return date.getTime();
}
const prepareContest = async (contestCode,options) =>{
    let contest = await fetchContest(contestCode,options);
    let problems = contest.problemsList;
    
    let problemData = [];
    problems.forEach(p => problemData.append({
        problemCode:p.problemCode,
        successfulSubmissions:p.successfulSubmissions,
        accuracy:p.accuracy
    }));

    let contestObj = {
        code : contest.code,
        name : contest.name,
        ranking_type : contest.ranking_type,
        startDate : ParseDate(contest.startDate),
        endDate : ParseDate(contest.endDate),
        announcements :contest.announcements,
        problemsList : problemData
    };
    const newContest = new Contest(contestObj);
    newContest.save();
};
module.exports = {prepareContest,prepareRanklist};