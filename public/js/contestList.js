var list = new Array();
var newList = new Array();
var attemptedlist = new Set();
var pageList = new Array();
var currentPage = 1;

const numberPerPage = 10;
const numberOfPages = 0;


const contestTable = document.getElementById("contest-table-data");
const firstButton = document.getElementById("first");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const lastButton = document.getElementById("last");


const getNumberOfPages = () => {
    return (newList.length + numberOfPages - 1) / numberPerPage;
};


const drawList = () => {
    contestTable.innerHTML = "";
    for (r = 0; r < pageList.length; r++) {
        if (attemptedlist.has(pageList[r].code))
            contestTable.innerHTML += `<tr>
                        <th scope="row">${r + 1}</th>
                        <td>${pageList[r].name}</td>
                        <td>${pageList[r].code}</td>
                        <td>${pageList[r].startDate}</td>
                        <td>Attempted</td>
                        </tr>`;
        else {
            contestTable.innerHTML += `<tr>
                        <th scope="row">${r + 1}</th>
                        <td>${pageList[r].name}</td>
                        <td>${pageList[r].code}</td>
                        <td>${pageList[r].startDate}</td>
                        <td> </td>
                    </tr>`;
        }
    }
};

function check() {
    previousButton.disabled = currentPage == 1 ? true : false;
    firstButton.disabled = currentPage == 1 ? true : false;
    nextButton.disabled = currentPage == numberOfPages ? true : false;
    lastButton.disabled = currentPage == numberOfPages ? true : false;
}

const loadList = () => {
    let begin = (currentPage - 1) * numberPerPage;
    let end = begin + numberPerPage;
    pageList = newList.slice(begin, end);
    drawList();
    check();
};

const changePage = (ele) => {
    if (ele == firstButton) {
        currentPage = 1;
    } else if (ele == previousButton) {
        currentPage -= 1;
    } else if (ele == nextButton) {
        currentPage += 1;
    } else if (ele == lastButton) {
        currentPage = numberOfPages;
    }
    loadList();
}


window.onload = async function () {
    let loader = document.getElementById("loader");
    let contestList = await (await fetch("/getContestList")).json();
    loader.classList.remove("spinner-border");
    list = contestList.contestList;
    newList = list;
    attemptedlist = contestList.attemptedContest;
    loadList();
};

const search = () => {
    let value = document.getElementById("search").value;

    if (value == "") {
        newList = list;
        loadList(); 
        return;
    }

    contestTable.innerHTML = "";
    value = value.toUpperCase();
    
    let filteredList = new Array();
    newList = list.filter((contest) => {
        return contest.name.toUpperCase().indexOf(value) > -1||
               contest.code.toUpperCase().indexOf(value) > -1 ;
    });

    if (newList.length == 0) {
        alert("No results Found");
        newList = list;
    }
    loadList();
}
