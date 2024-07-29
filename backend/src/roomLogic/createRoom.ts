import { Player } from "../gameLogic/Player";
import { Room, RoomState } from "./roomstate";

const roomState = RoomState.getInstance();

function generateRoomId() {
    return crypto.randomUUID();
}

const createRoom = (numberOfPlayers: number, player: Player): Room => {
    console.log("Welcome to the Poker game!");
    let newRoomId: string = "";
    while (true) {
        const roomId = generateRoomId();
        if (!roomState.getRoom(roomId)) {
            newRoomId = roomId;
            break;
        }
    }
    const room: Room = {
        roomId: newRoomId,
        numberOfPlayers: 1,
        gameState: "Starting",
        creationTime: Date.now(),
        players: [player],
        maxPlayers: numberOfPlayers
    }
    roomState.addRoom(room);
    // do lambda call to create room TO SAVE ROOM TO DB
    return room;
}

const joinRoom = (roomId: string, player: Player): {
    message?: string
    error?: string
} => {
    console.log(`Client ${player.id} joining room ${roomId}`);
    try {
        const room = roomState.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }
        if (room.numberOfPlayers > room.maxPlayers) {
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
        }
    } catch (e: any) {
        return {
            error: e.message
        }
    }
}

const leaveRoom = (roomId: string, clientId: string): {
    message?: string
    error?: string
} => {
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
        }
    } catch (e: any) {
        return {
            error: e.message
        }
    }
}

const deleteRoom = (roomId: string): {
    message?: string
    error?: string
} => {
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
        }
    } catch (e: any) {
        return {
            error: e.message
        }
    }
}

const getRoom = (roomId: string): Room | undefined => {
    return roomState.getRoom(roomId);
}

export {
    createRoom,
    joinRoom,
    leaveRoom,
    deleteRoom,
    getRoom
}
