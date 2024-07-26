import express from 'express';
import { Server as WebSocketServer } from 'ws';
import { Poker } from './gameLogic/Poker';
import { gameFormat } from './gameLogic/Card';
import { createRoom, deleteRoom, getRoom, joinRoom, leaveRoom } from './roomLogic/createRoom';
import { Player } from './gameLogic/Player';


interface GameStatusDetails {
    message: string;
}
interface Response {
    status: "success" | "error";
    message: string;
    data?: any;
    error?: string;
}

const gameStatusMap = new Map<number, GameStatusDetails>([
    [1, { message: "Game over" }],
    [2, { message: "Move to next round" }],
    [3, { message: "Folded, Move to next round" }],
    [4, { message: "Cannot add more players only 6 allowed" }],
    [5, { message: "Player added successfully" }],
    [7, { message: "Folded" }],
    [8, { message: "All in" }],
    [9, { message: "Call placed" }],
    [10, { message: "Bet placed" }],
    [11, { message: "Checked" }],
    [12, { message: "Every Player has checked, move to next round" }],
]);

const app = express();
const server = app.listen(3000, () => {
    console.log('Listening on port 3000');
});

const wss = new WebSocketServer({ server });

// Route to create a room
app.post('/create-room', (req, res) => {
    const noOfPlayers = Number(req.query.numberOfPlayers);
    if (!noOfPlayers || isNaN(noOfPlayers)) {
        res.status(400).send("Please provide a number of players.");
    }
    if (noOfPlayers > 6) {
        res.status(400).send("Maximum number of players is 6.");
    } else if (noOfPlayers < 2) {
        res.status(400).send("Minimum number of players is 2.");
    }
    const room = createRoom(noOfPlayers);
    if (room) {
        res.status(200).send(`Room ${room.roomId} created successfully.`);
    } else {
        res.status(400).send(`Room  already exists.`);
    }
});

// Route to join a room
app.post('/join-room', (req, res) => {
    const roomId = req.query.roomId as string;
    if (!roomId) {
        res.status(400).send("Please provide a room id.");
    }
    const name = req.query.name as string;
    if (!name) {
        res.status(400).send("Please provide a name.");
    }
    const balance = Number(req.query.balance);
    if (!balance || isNaN(balance)) {
        res.status(400).send("Please provide a balance.");
    }
    const player = new Player(name, balance);
    const response = joinRoom(roomId, player);
    if (response.error) {
        res.status(404).send(response.error);
    } else {
        res.status(200).send(response.message);
    }
});

// Route to leave a room
app.post('/leave-room', (req, res) => {
    const roomId = req.query.roomId as string;
    if (!roomId) {
        res.status(400).send("Please provide a room id.");
    }
    const clientId = req.query.clientId as string;
    if (!clientId) {
        res.status(400).send("Please provide a clientId id.");
    }
    const response = leaveRoom(roomId, clientId);
    if (response.error) {
        res.status(404).send(response.error);
    } else {
        res.status(200).send(response.message);
    }
});

app.post('/delete-room', (req, res) => {
    const roomId = req.query.roomId as string;
    if (!roomId) {
        res.status(400).send("Please provide a room id.");
    }
    const response = deleteRoom(roomId);
    if (response.error) {
        res.status(404).send(response.error);
    } else {
        res.status(200).send(response.message);
    }
});

wss.on('connection', (ws) => {
    console.log('Client connected');
    const pokerGame = Poker.createInstance("TexasHoldem" as gameFormat);
    ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);
        const response = handlePokerAction(message, pokerGame);
        ws.send(JSON.stringify(response));
    });
    ws.on('error', (err) => {
        console.log(`Error: ${err}`);
    })
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});


const handlePokerAction = (message: string, pokerGame: Poker): Response => {
    const { action, payload } = JSON.parse(message);
    const { prevBetSet, betMessage, betAmount, playerId, isPreFlop, isRiver, smallBlindValue, bigBlindValue, roomId, nextStep } = payload;
    switch (action) {
        case 'start-game':
            const room = getRoom(roomId);
            if (room === undefined) {
                return {
                    status: "error",
                    message: "Invalid action",
                    error: "Room not found"
                }
            }
            room.players?.forEach(player => pokerGame.addPlayer(player));
            const playersSorted = pokerGame.sortPlayers();
            pokerGame.dealerStartGame()
            return {
                status: "success",
                message: "Game started, All players are added, sorted and dealers have shuffled their cards",
                data: {
                    sortedPlayers: playersSorted,
                    nextUpdate: nextUpdates.SMALL_BLIND_UPDATE
                }
            }
        // pre flop done
        case 'small-binding-update':
            const smallBlind = pokerGame.smallBindUpdate(smallBlindValue);
            return {
                status: "success",
                message: smallBlind.message,
                data: {
                    smallBlindValue: smallBlindValue,
                    nextUpdates: nextUpdates.BIG_BLIND_UPDATE
                }
            }
        case 'big-blind-update':
            const bigBlind = pokerGame.bigBindUpdate(bigBlindValue);
            return {
                status: "success",
                message: bigBlind.message,
                data: {
                    bigBlindValue: bigBlindValue,
                    nextUpdates: nextUpdates.BET
                }
            }
        // forced binds done
        case "get-cards":
            const playerCards = pokerGame.getCards(playerId);
            const communityCards = pokerGame.getCommunityCards();
            const response = {
                "playerCards": playerCards,
                "communityCards": communityCards
            };
            return {
                status: "success",
                message: "Cards sent successfully",
                data: response
            }
        case 'bet':
            let code = 0, message = "";
            if (prevBetSet) {
                const response = pokerGame.betUpdateOnPrevBet(betMessage, betAmount);
                code = response.code;
                message = response.message;
                if (code === 1) {
                    return {
                        status: "success",
                        message: `Winner is ${response.message}`,
                        data: {
                            winner: response.winner,
                            nextUpdate: nextUpdates.END_GAME
                        }
                    }
                }
            } else {
                const response = pokerGame.betUpdateOnNoBetSet(betMessage, betAmount);
                code = response.code;
                message = response.message;
            }
            if (isRiver) {
                const winner = pokerGame.displayWinner();
                const winner_message = winner ? winner.name : "No one";
                return {
                    message: `Winner is ${winner_message}`,
                    status: "success",
                    data: {
                        winner: winner,
                        nextUpdate: nextUpdates.END_GAME
                    }
                }
            }
            if (isPreFlop) {
                pokerGame.dealAtTheTable(true);
            } else {
                pokerGame.dealAtTheTable(false);
            }
            return {
                status: "success",
                message: message,
                data: {
                    nextUpdate: nextUpdates.BET,
                    code: code
                }
            }
        // ill send the response to the client, every client will then request to get cards
    }
    return {
        status: "error",
        message: "Invalid action",
        error: "Invalid action"
    }
};


enum nextUpdates {
    START_GAME = "START_GAME",
    SMALL_BLIND_UPDATE = "SMALL_BLIND_UPDATE",
    BIG_BLIND_UPDATE = "BIG_BLIND_UPDATE",
    BET = "BET",
    GET_CARDS = "GET_CARDS",
    END_GAME = "END_GAME"
}