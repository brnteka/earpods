import countdown from 'countdown';

var coundownhours = document.getElementById("countdown-hours");
var coundownminutes = document.getElementById("countdown-minutes");
var coundownseconds = document.getElementById("countdown-seconds");

function makeMeTwoDigits(n){
    return (n < 10 ? "0" : "") + n;
}

var today = new Date();
today.setHours(today.getHours() + 10);
today.setSeconds(today.getSeconds() - 1);

var timerId = countdown(
    today,
    function (ts) {
        coundownhours.innerHTML = ts.hours;
        coundownminutes.innerHTML = makeMeTwoDigits(ts.minutes);
        coundownseconds.innerHTML = makeMeTwoDigits(ts.seconds);
    },
    countdown.HOURS | countdown.MINUTES | countdown.SECONDS
);