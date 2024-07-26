import { error } from "console";
import { Player } from "../gameLogic/Player";

const rooms: Room[] = []
type Room = {
    roomId: string,
    numberOfPlayers: number,
    maxPlayers: number,
    gameState: GameState,
    creationTime: number,
    players?: Player[]
}

type GameState = "Starting" | "Playing" | "Finished"

function generateRoomId() {
    const roomId = crypto.randomUUID();
    return roomId;
}


const createRoom = (numberOfPlayers: number): Room => {
    console.log("Welcome to the Poker game!");
    let newRoomId: string = "";
    while (true) {
        const roomId = generateRoomId();
        if (rooms.find(room => room.roomId === roomId)) {
            continue;
        } else {
            newRoomId = roomId;
            break;
        }
    }
    const room: Room = {
        roomId: newRoomId,
        numberOfPlayers: numberOfPlayers,
        maxPlayers: 6,
        gameState: "Starting",
        creationTime: Date.now(),
        players: []
    }
    rooms.push(room);

    // do lambda call to create room TO SAVE ROOM TO DB
    return room;
}

const joinRoom = (roomId: string, player: Player): {
    message?: string
    error?: string
} => {
    console.log(`Client ${player.id} joining room ${roomId}`);
    try {
        const room = rooms.find(room => room.roomId === roomId);
        if (!room) {
            throw new Error("Room not found");
        }
        if (room.numberOfPlayers >= room.maxPlayers) {
            throw new Error("Room is full");
        }
        // add this player to room
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
        const room = rooms.find(room => room.roomId === roomId);
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
        // remove this player from room
        room.numberOfPlayers -= 1;
        room.players = room.players.filter(player => player.id !== clientId);
        console.log(`Client ${clientId} left room ${roomId}`);
        return {
            message: `Client ${clientId} left room ${roomId}`
        }
    } catch (e: any) {
        return {
            error: e.message
        }
    }
    // do lambda call to leave room TO UPDATE ROOM IN DB
}

const deleteRoom = (roomId: string): {
    message?: string
    error?: string
} => {
    try {
        if (!roomId) {
            throw new Error("Please provide a room id.");
        }
        const room = rooms.find(room => room.roomId === roomId);
        if (!room) {
            throw new Error("Room not found");
        }
        rooms.splice(rooms.indexOf(room), 1);
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
    if (rooms.length === 0) {
        return undefined;
    }
    const room = rooms.find(room => room.roomId === roomId);
    if (!room) {
        return undefined;
    }
    return room;
}


export {
    createRoom,
    joinRoom,
    leaveRoom,
    deleteRoom, getRoom
}