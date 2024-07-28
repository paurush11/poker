"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const Poker_1 = require("./gameLogic/Poker");
const createRoom_1 = require("./roomLogic/createRoom");
const Player_1 = require("./gameLogic/Player");
const handlePokerAction_1 = require("./WebSocketLogic/handlePokerAction");
const cors_1 = __importDefault(require("cors"));
const roomstate_1 = require("./roomLogic/roomstate");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
const server = app.listen(3000, () => {
    console.log('Listening on port 3000');
});
const wss = new ws_1.Server({ server });
// Route to create a room
app.post('/create-room', (req, res) => {
    const noOfPlayers = Number(req.body.numberOfPlayers);
    if (!noOfPlayers || isNaN(noOfPlayers)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid input: Please provide a valid number of players.",
            error: "Invalid number provided."
        });
    }
    if (noOfPlayers > 6) {
        return res.status(400).json({
            status: "error",
            message: "Maximum number of players is 6.",
            error: "Number exceeds maximum limit."
        });
    }
    if (noOfPlayers < 2) {
        return res.status(400).json({
            status: "error",
            message: "Minimum number of players is 2.",
            error: "Number falls below minimum requirement."
        });
    }
    const name = req.body.username;
    if (!name) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a name.",
            error: "Name missing from request."
        });
    }
    const balance = Number(req.body.balance);
    if (!balance || isNaN(balance)) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a valid balance.",
            error: "Balance is invalid or missing."
        });
    }
    const player = new Player_1.Player(name, balance); // Assuming Player is a constructor you've defined elsewhere
    const room = (0, createRoom_1.createRoom)(noOfPlayers, player); // Implement this function to handle room creation
    if (room) {
        res.status(200).json({
            status: "success",
            message: "Room created successfully",
            data: { roomId: room.roomId, playerId: player.id } // Assume createRoom returns an object with roomId
        });
    }
    else {
        res.status(400).json({
            status: "error",
            message: "Room creation failed",
            error: "Room already exists."
        });
    }
});
// Route to join a room
app.post('/join-room', (req, res) => {
    const roomId = req.body.roomId;
    if (!roomId) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a room id.",
            error: "Room ID missing from request."
        });
    }
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a name.",
            error: "Name missing from request."
        });
    }
    const balance = Number(req.body.balance);
    if (!balance || isNaN(balance)) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a valid balance.",
            error: "Balance is invalid or missing."
        });
    }
    const player = new Player_1.Player(name, balance); // Assuming Player is a constructor you've defined elsewhere
    const response = (0, createRoom_1.joinRoom)(roomId, player); // Assuming joinRoom is a function that attempts to add a player to a room and returns an object with 'error' or 'message'
    if (response.error) {
        res.status(404).json({
            status: "error",
            message: "Failed to join room.",
            error: response.error
        });
    }
    else {
        res.status(200).json({
            status: "success",
            message: response.message,
            data: { playerDetails: player } // Optionally include player details or other relevant data
        });
    }
});
// Route to leave a room
app.post('/leave-room', (req, res) => {
    const roomId = req.body.roomId;
    if (!roomId) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a room id.",
            error: "Room ID is missing from request."
        });
    }
    const clientId = req.body.clientId;
    if (!clientId) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a clientId.",
            error: "Client ID is missing from request."
        });
    }
    const response = (0, createRoom_1.leaveRoom)(roomId, clientId); // Assuming leaveRoom is a function that attempts to remove a client from a room and returns an object with 'error' or 'message'
    if (response.error) {
        res.status(404).json({
            status: "error",
            message: "Failed to leave room.",
            error: response.error
        });
    }
    else {
        res.status(200).json({
            status: "success",
            message: response.message,
            data: { roomId: roomId, clientId: clientId } // Optionally include roomId and clientId or other relevant data
        });
    }
});
app.post('/delete-room', (req, res) => {
    const roomId = req.query.roomId;
    if (!roomId) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a room id.",
            error: "Room ID is missing from request."
        });
    }
    const response = (0, createRoom_1.deleteRoom)(roomId); // Assuming deleteRoom tries to delete a room and returns an object with 'error' or 'message'
    if (response.error) {
        res.status(404).json({
            status: "error",
            message: "Failed to delete room.",
            error: response.error
        });
    }
    else {
        res.status(200).json({
            status: "success",
            message: response.message,
            data: { roomId: roomId } // Include roomId or other relevant data if needed
        });
    }
});
wss.on('connection', (ws) => {
    console.log('Client connected');
    const pokerGame = new Poker_1.Poker("TexasHoldem");
    console.log(roomstate_1.RoomState.getInstance().getRooms());
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        const response = (0, handlePokerAction_1.handlePokerAction)(message, pokerGame);
        console.log(response);
        ws.send(JSON.stringify(response));
    });
    ws.on('error', (err) => {
        console.log(`Error: ${err}`);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
