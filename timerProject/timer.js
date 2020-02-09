document.getElementById("setTimer").onclick = function() {setTimer()};
document.getElementById("reset").onclick = function() {reset()};

let pButton = document.getElementById("pausePlay");
pButton.onclick = function() {changePlayState()};

let run = false;
var intervalID = window.setInterval(runTimer, 1000);

//Time that is entered
let hours = document.getElementById('hrs');
hours.onkeydown = function(e) {clearLeadingZeroes(hours); return isPositive(e) && isntTooBig(hours,e, 99);}

let minutes = document.getElementById('mins');
minutes.onkeydown = function(e) {clearLeadingZeroes(minutes); return isPositive(e) && isntTooBig(minutes,e, 59);}

let seconds = document.getElementById('secs');
seconds.onkeydown = function(e) {clearLeadingZeroes(seconds); return isPositive(e) && isntTooBig(seconds,e, 59);}


//Time on timer
let tHours = document.getElementById('thrs');
let tMinutes = document.getElementById('tmins');
let tSeconds = document.getElementById('tsecs');


function clearLeadingZeroes(num){
     var number = num.value;
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

//converts to a number and converts it to a string and adds 
//a leading zero to numbers if they are < 10
function addLeadZero(num){
    num = num.toString();
    if(num<10)    
        num = "0" + num;

    return num;
}

function updateTimer(hrs, mins, secs){
    hrs = addLeadZero(hrs);
    mins = addLeadZero(mins);
    secs = addLeadZero(secs);

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
        secs = parseInt(tSeconds.innerHTML);
        mins = parseInt(tMinutes.innerHTML);
        hrs = parseInt(tHours.innerHTML);

        if(secs == 0){
            if(mins == 0){
                if(hrs == 0){
                    run=false;
                }else{
                    hrs--;
                    mins=59;
                    secs=59;
                } 
            }else{
                mins--;
                secs=59;
            }
        }else{
            secs--;
        }
        
        updateTimer(hrs, mins, secs);
    }
}

function changePlayState(){
    var hrs = parseInt(tHours.innerHTML);
    var mins = parseInt(tMinutes.innerHTML);
    var secs = parseInt(tSeconds.innerHTML);

    if(hrs + mins + secs){
        run = !run;
        if(run){
            pButton.value = "Pause";
        }else{
            pButton.value = "Play";
        }
    }
}

function reset(){
    hours.value = 0;
    minutes.value=0;
    secs.value=0;
    run = false;
    
    tHours.innerHTML = "00";
    tMinutes.innerHTML = "00";
    tSeconds.innerHTML = "00";
}
