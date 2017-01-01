//Lets require/import the HTTP module
var http = require('http');
var url = require('url');
var formidable = require('formidable');
var validator = require('validator');
var cors = require('cors');
var express = require('express');
var mysql = require('mysql');
var chance = require('chance');
var parser = require('body-parser');

var app = express();
app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded( {
    extended: true
}));

var db = mysql.createConnection({
    host: 'localhost',
    // credenciais 1
    user: 'up201200296',
    password: 'kappa123',
    
    // credenciais 2
    //user: 'up201202482'
});

db.connect(function(error)  {
    if(error) console.log(error);
    
    var query = db.query('USE up201200296;', function(err, result) {
        if(err) console.log(err);
    });
});

//chamar modulo crypto para encriptaçao de passwords
var crypto = require('crypto');

function createHash(pass) {
    return crypto.createHash('md5').update(pass).digest('hex');
}

var RSG = new chance();

//register
/*

Para as passwords:
Comparaçao:
"Assim, o valor guardado na coluna pass deve ser uma sequência de dígitos hexadecimais correspondente a um hash MD5 da //concatenação da "pass" com o sal".

Geraçao:
temos de gerar um salt e um hash = pass+salt
o salt sao 4 chars aleatorios, usando modulo chance

Na insercao de novos users na database:
de acordo com a tabela Users : name, pass, salt
*/
app.post('/register', function(request, response) {
    // validator stuff
    var req_name = request.body.name;
    var req_pass = request.body.pass;
    
    if(validator.isAlphanumeric(req_name)) {
        var query_this = db.query('select * from Users where name = ?', [req_name], function(err, answer) {
            if(err) console.log(err);
            
            if(answer.length > 0) {
                console.log("User exists");
                var player = answer[0];
                
                if(createHash(req_pass + player.salt) == player.pass) {
                    console.log("Success");
                    response.json({});
                }
                else {
                    console.log("dats wrung");
                    response.json({"error": "Utilizador registado com password diferente"});
                }
            }
            else {
                console.log("New user");
                
                var playerSalt = RSG.string({length : 4});
                var playerHash = createHash(req_pass + playerSalt);
                
                var post = {name : req_name, pass : playerHash, salt : playerSalt};
                var query = db.query('insert into Users set ?', [post], function(err, answer) {
                    if(err) console.log(err);
                    console.log("User registred");
                    response.json({});
                });
            }
        });
    }
    else {
        response.json({"erro": "Jogador invalido"});
    }
});

app.post('/ranking', function(request, response) {
    var diff = request.body.level;
    var query = db.query('SELECT * FROM Rankings WHERE level = ? ORDER BY boxes DESC, time ASC LIMIT 10;', [diff], function(err, answer) {
		if (err) console.log(err);
		response.json({"ranking":answer});
	});
});

//Lets define a port we want to listen to
const PORT=8042; 

//Lets start our server
var server = app.listen(PORT, '0.0.0.0', function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", server.address().address, PORT);
});