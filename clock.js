document.getElementById("setTimer").onclick = function() {setTimer()};

let run = false;
var intervalID = window.setInterval(runTimer, 1000);

//Time that is entered
let hours = document.getElementById('hrs');
let minutes = document.getElementById('mins');
let seconds = document.getElementById('secs');

hours.onkeydown = function(e) {clearLeadingZeroes(hours); return isPositive(e) && isntTooBig(hours,e, 99);}
minutes.onkeydown = function(e) {clearLeadingZeroes(minutes); return isPositive(e) && isntTooBig(minutes,e, 59);}
seconds.onkeydown = function(e) {clearLeadingZeroes(seconds); return isPositive(e) && isntTooBig(seconds,e, 59);}


//Time on timer
let tHours = document.getElementById('thrs');
let tMinutes = document.getElementById('tmins');
let tSeconds = document.getElementById('tsecs');



function clearLeadingZeroes(num){
     var number = num.value;
    // number = number.toString();
    //  parseInt(number, 10);
     number = number.replace(/^0+/, '');
    num.value = number;
}

function isPositive(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
    return true;
}

function isntTooBig(num, e, max){
    var total = num.value;
    total = total.toString();
    total += e.key;
    total = parseInt(total);

    if(total>max) {
       num.value=max;
       return false;
    }
    return true;

}

function updateTimer(hrs, mins, secs){
    tHours.innerHTML = hrs;
    tMinutes.innerHTML = mins;
    tSeconds.innerHTML = secs;
}

function setTimer(){
    if(!hours.value) hours.value= 0;
    if(!minutes.value) minutes.value= 0;
    if(!seconds.value) seconds.value= 0;
    updateTimer(hours.value, minutes.value, seconds.value);

    run = true;
}

function runTimer(){
    var hrs, mins, secs;
    if(run){
        secs = tSeconds.innerHTML-1;
        
        updateTimer(hours.value, minutes.value, secs);
    }
}