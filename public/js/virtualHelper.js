"use strict";
const timeDisplay = document.getElementById("rem-time");
const endVirtualButton = document.getElementById("end-virtual");

const finishVirtual = (contestCode) => {
    confirm("You are ending this virtual contest.");
    window.location.href = `/virtual/endVC?code=${contestCode}`;
}

const countdown = (endTime) => {
    let countDownDate = new Date(endTime).getTime();
    let x = setInterval(() => {
        // displays remaining time for contest to end.
        let curTime = new Date().getTime();
        let timeLeft = countDownDate - curTime;

        let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        timeDisplay.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";

        if (timeLeft < 0) {
            clearInterval(x);
            timeDisplay.innerHTML = "Virtual Finished";
            endVirtualButton.remove();
        }
    }, 1000);
}


let currentRanklist = [];
const fetchRanklistAndStore = async (contestCode) => {
    const response = await fetch(`/virtual/fetchRanklist/${contestCode}`);
    let ranklist = await response.json(), data = [];
    ranklist.ranks.forEach((rank) => { data.push({ username: rank.username, problemScore: rank.problemScore }); });
    localStorage.setItem("ranklist", LZString.compress(JSON.stringify(data)));
    localStorage.setItem("curContest", contestCode);
}


async function renderCurrentRanklist() {
    let rankData = localStorage.getItem("ranklist");
    let curContest = localStorage.getItem("curContest");
    if (rankData !== null && curContest == '<%= contestCode %>') {
        rankData = await LZString.decompress(rankData).json();
    } else {
        await fetchRanklistAndStore('<%= contestCode %>');
        rankData = LZString.decompress(localStorage.getItem("ranklist"));
    }

    rankData = JSON.parse(rankData);

    let startTime = new Date("<%= startTime %>").getTime();
    let curTime = new Date().getTime();

    let realStartTime = new Date("<%= realStartTime %>").getTime() / 1000;
    let timePassed = (curTime - startTime) / 1000;
    let penaltyWeight = 20 * 60;
    let currentRankList = [];
    for (let i = 0; i < rankData.length; i++) {
        const rank = rankData[i];
        let score = 0, user = rank.username, penalty = 0;
        rank.problemScore.forEach(el => {
            if (el.bestSolutionTime - realStartTime <= timePassed) {
                score += el.score;
                penalty += el.bestSolutionTime - realStartTime;
                penalty += parseInt(el.penalty) * penaltyWeight;
            }
        });
        if (score > 0) {
            currentRankList.push({
                username: user,
                score: score,
                penalty: new Date(penalty * 1000).toISOString().substr(11, 8)
            });
        }
    }

    currentRankList.sort((a, b) => {
        if (a.score == b.score)
            return a.penalty - b.penalty;
        else return b.score - a.score;
    });

    let table = document.getElementById("contest-table").getElementsByTagName('tbody')[0];
    let rankid = 1;
    currentRankList.forEach(a => {
        let newRow = table.insertRow(table.rows.length);
        newRow.innerHTML = `<tr><td>${rankid}</td><td>${a.username}</td><td>${a.score}</td><td>${a.penalty}</td></tr>`;
        rankid++;
    });
}