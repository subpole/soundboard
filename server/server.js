const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

let allRoomsInfo = {"0FYP": "UnU"};

io.on('connection', (socket) => {
	console.log("--conectado--");

	socket.on('disconnect', () => {
		console.log("user disconnected");
	});

	socket.on('stopQueue', () => {
		socket.to(socket.roomId).emit('stopQueue2');
	});

	socket.on('leaveRoom', () => {
		console.log("leaveroom", socket.roomId);
		socket.leave(socket.roomId)
		socket.roomId = null
	});

	socket.on('createRoom', (callback) => {
		let roomId = (Math.random() + 1).toString(36).substring(8).toUpperCase();
		// roomId = "UWU";
		while (allRoomsInfo[roomId]) {
			roomId = (Math.random() + 1).toString(36).substring(8).toUpperCase();
		}
		let roomInfo = {
			canControl: true
		}
		allRoomsInfo[roomId] = roomInfo
		socket.controller = false

		console.log(roomId, roomInfo);
		joinRoom(socket, roomId.toUpperCase());

		callback({
			"roomId": roomId
		})
	})

	socket.on('roomExists', (roomId, callback) => {
		if (roomId) {
			callback({
				"roomExists": roomExists(roomId.toUpperCase())
			})
		} else {
			callback({
				roomExists: false
			})
		}
	})

	socket.on('joinRoom', (roomId, callback) => {
		if (roomId) {
			if (roomExists(roomId.toUpperCase())) {
				callback({
					roomExists: true,
				})

				joinRoom(socket, roomId.toUpperCase());
			} else {
				// joinRoom(socket, roomId);

				callback({
					roomExists: false,
					// msg: "la room no existia pero la ha creaod uwu"
				})
			}
		} else {
			callback({
				roomExists: false
			})
		}
	})

	socket.on("owo", (audio) => {
		console.log(`peticion owo ${socket.id}-${socket.roomId} - ${audio}`);
		socket.to(socket.roomId).emit('ewe', audio);

	})
});

function roomExists(roomId) {
	if (!allRoomsInfo[roomId]) {
		return false
	} else {
		return true
	}
}

function joinRoom(socket, roomId) {
	console.log(`someone joined ${roomId}`);
	// Lo saca de otra sala si ya estaba
	if (socket.roomId != null) {
		console.log("ya tenia una sala antes!");
		socket.leave(socket.roomId)
	}
	socket.join(roomId);
	socket.roomId = roomId
}

server.listen(32000, () => {
	console.log('listening on *:32000');
});