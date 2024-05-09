class SocketClient {
    constructor() {
        console.log("aa", socketUrl);
        this.socket = io(socketUrl)
        this.connected = false
    }
    socketons() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
        
        // Event listener for connection error
        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
        
        // Event listener for disconnection
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        
        // Event listener for reconnection attempt
        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`Attempting to reconnect (attempt ${attemptNumber})`);
        });
        
        // Event listener for reconnection success
        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`Reconnected to server after ${attemptNumber} attempts`);
        });
        
        // Event listener for reconnection failure
        this.socket.on('reconnect_failed', () => {
            console.error('Failed to reconnect');
        });
        

    }
    // Manually reconnect in case of disconnection
    reconnect() {
        if (!this.socket.connected) {
            this.socket.connect();
        }
    }
        
    getSocket() {
        return this.socket;
    }
    connectToRoom(roomId, cb) {
        console.log(roomId);
        this.socket.emit("joinRoom", roomId, (data) => {
            console.log(data);
            if (data.roomExists) {
                console.log(`1existe la sala1112 ${roomId}`);
                this.roomId = roomId
                this.socketOn()
                this.connected = true
                console.log("1");
            } else {
                console.log("2no existe la sala1112");
                this.connected = false
                this.roomId = null
            }

            if (cb) {
                cb(data.roomExists)
            }
        })
    }

    emitMove(data) {
        this.socket.emit('sendRotation', data);
    }

    emitSetPosition(data) {
        this.socket.emit('sendArmPosition2', data);
    }

    emitUpdateRoation(armRotations) {
        this.socket.emit("updateArmRotation", armRotations)
    }

    disconnect() {
        this.socket.emit("leaveRoom")
        this.connected = false
    }

    isConnected() {
        return this.connected;
    }

    socketOn() {
        this.socket.on('initialArmPosition', function (data) {
            console.log("[socket] initialPosition",data);
            window.ip = data
            arm.setArmRotations(data)
        })
        
        this.socket.on('positionArm2', function (data) {
            console.log("[socket] posicionar brazo",data);
            arm.setArmRotation(data)
        })
        
        this.socket.on('rotate', (data) =>  {
            console.log("[socket] rotar brazo",data);
            arm.newRotation(data)
        })
        // no funciona
        this.socket.on('togglePauseResume', () =>  {
            arm.togglePauseResume()
        })
        // no funciona
        this.socket.on('stopQueue2', () =>  {
            console.log("[socket] stop cola");
            arm.stopQueue()
        })
    }
}