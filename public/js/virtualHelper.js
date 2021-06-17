function finishVirtual(contestCode) {
    confirm("You are ending this virtual contest.");
    window.location.href = `/virtual/endVC?code=${contestCode}`;
}

function countdown(endTime) {
    let countDownDate = new Date(endTime).getTime();
    let x = setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("rem-time").innerHTML =
            hours + "h " + minutes + "m " + seconds + "s ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("rem-time").innerHTML = "Virtual Finished";
            document.getElementById("end-virtual").remove();
        }
    }, 1000);
}