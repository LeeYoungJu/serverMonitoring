var CommonFunc = require('./commonFunc.js');

var express = require('express');
var http = require('http');

var socketio = require('socket.io');
 
var app = express();


module.exports = {
	listenWeb: function(port) {
		app.set('port', port);		

		//웹서버 구동
		var server = http.createServer(app).listen(app.get('port'), function() {
			console.log('WEB server start...');	
		})

		//웹소켓
		var io = socketio.listen(server);
		var webServer = new WebServer(io);

		return webServer;
	},

	
}

//리턴되는 클래스
function WebServer(io) {
	this.io = io;

	this.init();
}

WebServer.prototype.init = function() {
	this.io.sockets.on('connection', function(socket) {
		console.log('connection info : ', socket.request.connection._peername);
		console.log(socket.request.connection);
	});
}

WebServer.prototype.sendDataToAll = function(data, type) {
	this.io.sockets.emit(type, data);
	
	console.log(CommonFunc.getCurrentDate()+' success to send data (' + type+')');
}









