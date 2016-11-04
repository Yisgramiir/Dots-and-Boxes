//global vars
var startDate;
var PlayerTimer;
var SuperAITimer;
var currTime = 0;
var currTimeAI = 0;

// timer constructor
function gameTimer(date, clock){
	var currentTime = (new Date - date);
	var currentTimeEx = new Date(currentTime);
    if(clock === "clock1") currTime = currentTimeEx;
    else if(clock === "clock2") currTimeAI = currentTimeEx;
    
    
	var currentHours = currentTimeEx.getHours();
	var currentMinutes = currentTimeEx.getMinutes();
	var currentSeconds = currentTimeEx.getSeconds();
	
	currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
	currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
	
	var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds;
	
	document.getElementById(clock).firstChild.nodeValue = currentTimeString;
}

// start timer
function startPlayerTimer(){
    PlayerTimer = setInterval(function() {gameTimer(startDate, 'clock1');}, 1000);
}

function startSuperAITimer(){
    var auxDate = new Date();
    SuperAITimer = setInterval(function() {gameTimer(auxDate, 'clock2');}, 1000);
}

// continue timer
function continuePlayerTimer(){
    startDate = new Date(new Date() - currTime);
    PlayerTimer = setInterval(function() {gameTimer(startDate, 'clock1');}, 1000);
}

function continueSuperAITimer(){
    startDate = new Date(new Date() - currTimeAI);
    SuperAITimer = setInterval(function() {gameTimer(startDate, 'clock2');}, 1000);
}

// stop timer
function stopPlayerTimer(){
    clearInterval(PlayerTimer);
}

function stopSuperAITimer(){
    clearInterval(SuperAITimer);
}

// reset timer
function resetPlayerTimer(){
    stopPlayerTimer();
    document.getElementById('clock1').firstChild.nodeValue = null;
    currTime = 0;
    PlayerTimer = 0;
}

function resetSuperAITimer(){
    stopSuperAITimer();
    document.getElementById('clock2').firstChild.nodeValue = null;
    currTimeAI = 0;
    SuperAITimer = 0;
}
