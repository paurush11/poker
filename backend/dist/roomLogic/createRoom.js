"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoom = exports.deleteRoom = exports.leaveRoom = exports.joinRoom = exports.createRoom = void 0;
const roomstate_1 = require("./roomstate");
const roomState = roomstate_1.RoomState.getInstance();
function generateRoomId() {
    return crypto.randomUUID();
}
const createRoom = (numberOfPlayers, player) => {
    console.log("Welcome to the Poker game!");
    let newRoomId = "";
    while (true) {
        const roomId = generateRoomId();
        if (!roomState.getRoom(roomId)) {
            newRoomId = roomId;
            break;
        }
    }
    const room = {
        roomId: newRoomId,
        numberOfPlayers: numberOfPlayers,
        maxPlayers: 6,
        gameState: "Starting",
        creationTime: Date.now(),
        players: [player]
    };
    roomState.addRoom(room);
    // do lambda call to create room TO SAVE ROOM TO DB
    return room;
};
exports.createRoom = createRoom;
const joinRoom = (roomId, player) => {
    console.log(`Client ${player.id} joining room ${roomId}`);
    try {
        const room = roomState.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }
        if (room.numberOfPlayers >= room.maxPlayers) {
            throw new Error("Room is full");
        }
        room.numberOfPlayers += 1;
        if (!room.players) {
            room.players = [];
        }
        room.players.push(player);
        console.log(`Client ${player.id} joined room ${roomId}`);
        // do lambda call to join room TO UPDATE ROOM IN DB
        return {
            message: `Client ${player.id} joined room ${roomId}`
        };
    }
    catch (e) {
        return {
            error: e.message
        };
    }
};
exports.joinRoom = joinRoom;
const leaveRoom = (roomId, clientId) => {
    console.log(`Client ${clientId} leaving room ${roomId}`);
    try {
        const room = roomState.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }
        if (!room.players) {
            throw new Error("No players in room");
        }
        const player = room.players.find(player => player.id === clientId);
        if (!player) {
            throw new Error("Player not found");
        }
        room.numberOfPlayers -= 1;
        room.players = room.players.filter(player => player.id !== clientId);
        console.log(`Client ${clientId} left room ${roomId}`);
        // do lambda call to leave room TO UPDATE ROOM IN DB
        return {
            message: `Client ${clientId} left room ${roomId}`
        };
    }
    catch (e) {
        return {
            error: e.message
        };
    }
};
exports.leaveRoom = leaveRoom;
const deleteRoom = (roomId) => {
    try {
        if (!roomId) {
            throw new Error("Please provide a room id.");
        }
        const room = roomState.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }
        roomState.removeRoom(roomId);
        // lambda to remove room from db
        return {
            message: `Room ${roomId} deleted`
        };
    }
    catch (e) {
        return {
            error: e.message
        };
    }
};
exports.deleteRoom = deleteRoom;
const getRoom = (roomId) => {
    return roomState.getRoom(roomId);
};
exports.getRoom = getRoom;
