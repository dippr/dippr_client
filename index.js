require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const httpServer = http.Server(app);

const PORT = 80;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.use('/', express.static(path.join(__dirname, 'public')));

httpServer.listen(PORT, function(){
	console.log('listening on *:' + PORT);
});