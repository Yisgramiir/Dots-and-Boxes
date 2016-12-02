var game_key;
var game_ID;
// while waiting for oponent, this is false, when oponent arrives, this becomes true
var gameIsRunning = false;

function joinGame(){
    getDiff();
    var nome = document.getElementById("id").value.toString();
    var pw = document.getElementById("pw").value.toString();
    var lvl = difficulty.toLowerCase();
    var group = 42;
    var params = JSON.stringify({name: nome, pass: pw, level: lvl, group: group});
    
    //request itself
    var join_req = new XMLHttpRequest();
    
    join_req.onreadystatechange = function(){
    
        if(join_req.readyState !== 4){return;}
        
        if(join_req.status !== 200){
            window.alert("Error - Bad Request, error: "+join_req.status+" readystate: "+join_req.readyState);
            return;
        }
        
        var sv_response = JSON.parse(join_req.responseText);
        
        if(sv_response.error !== undefined) {
            alert(sv_response.error);
        }
        
        else {
            game_key = sv_response.key;
            game_ID = sv_response.game;
            goToMult();
        }
    }
    
    join_req.open("post","http://twserver.alunos.dcc.fc.up.pt:8000/join",true);
    join_req.setRequestHeader("Content-type", "application/json"); 
    join_req.send(params);
}// end of method

//only possible of still waiting for an oponent
function leave() {
    var params = JSON.stringify({
        name: username,
        game: game_ID,
        key: game_key
    });
    
    var leave_req = new XMLHttpRequest();
    leave_req.onreadystatechange = function() {
        
        if(leave_req.readyState !== 4){return;}
        
        if(leave_req.status !== 200){
            window.alert("Error - Bad Request, error: "+leave_req.status+" readystate: "+leave_req.readyState);
            return;
        }
        
        var sv_response = JSON.parse(leave_req.responseText);
        if(gameIsRunning === false){
            leave_req.open("post", "http://twserver.alunos.dcc.fc.up.pt:8000/leave",true);
            leave_req.setRequestHeader("Content-type", "application/json"); 
            leave_req.send(params);
        }
        else window.alert("You can't give up now!");
    }
}

function backFromMP(){
    if(gameIsRunning===false)switchDiv('multiplayer','main_menu');
}

function notify(){
    var o = play.ori;
    var r = play.row;
    var c = play.col;
    var params = JSON.stringify({
        name: username, 
        game: game_ID,
        key: game_key,
        orient: o,
        row: r,
        col: c
    });
    
    var notify_req = new XMLHttpRequest();
    
    notify_req.onreadystatechange = function() {
        
        if(notify_req.readyState !== 4){return;}
        
        if(notify_req.status !== 200){
            window.alert("Error - Bad Request, error: "+notify_req.status+" readystate: "+notify_req.readyState);
            return;
        }
        
        var sv_response = JSON.parse(notify_req.responseText);
        
        if(sv_response.error !== undefined) {
            alert(sv_response.error);
            return false;
        }

        return true;
    }
}

function goToMult() {
    switchDiv('main_menu', 'multiplayer');
    sse = new EventSource("http://twserver.alunos.dcc.fc.up.pt:8000/update?name=" + username + "&game=" + game_ID + "&key=" + game_key);
    updateGameState();
}

function updateGameState() {
    
}

function ranking() {
    makeRequest(JSON.stringify({level: "beginner"}),"ranking");
    makeRequest(JSON.stringify({level: "intermediate"}),"ranking");
    makeRequest(JSON.stringify({level: "advanced"}),"ranking");
    makeRequest(JSON.stringify({level: "expert"}),"ranking");
}
// {name:asndas,joa:oabsdojabs}
function makeRequest(params,afterbar){
    var toSend = JSON.parse(params);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(request.readyState !== 4){return;}
        if(request.status !== 200){
            window.alert("Error - Bad Request, error: "+request.status+" readystate: "+request.readyState);
            return;
        }  
        var sv_response = JSON.parse(request.responseText);
        
        request.open("post", "http://twserver.alunos.dcc.fc.up.pt:8000/"+afterbar,true);
        request.setRequestHeader("Content-type", "application/json"); 
        request.send(toSend);
        window.alert(sv_response);
    }
    
}// end method