"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePokerAction = void 0;
const createRoom_1 = require("../roomLogic/createRoom");
var nextUpdates;
(function (nextUpdates) {
    nextUpdates["READY"] = "READY";
    nextUpdates["START_GAME"] = "START_GAME";
    nextUpdates["SMALL_BLIND_UPDATE"] = "SMALL_BLIND_UPDATE";
    nextUpdates["BIG_BLIND_UPDATE"] = "BIG_BLIND_UPDATE";
    nextUpdates["BET"] = "BET";
    nextUpdates["GET_CARDS"] = "GET_CARDS";
    nextUpdates["END_GAME"] = "END_GAME";
})(nextUpdates || (nextUpdates = {}));
const gameStatusMap = new Map([
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
const handlePokerAction = (message, pokerGame) => {
    var _a, _b;
    const { action, payload } = JSON.parse(message);
    const { prevBetSet, betMessage, betAmount, playerId, isPreFlop, isRiver, smallBlindValue, bigBlindValue, roomId, nextStep } = payload;
    const room = (0, createRoom_1.getRoom)(roomId);
    switch (action) {
        case 'player-join':
            const player = (_a = room === null || room === void 0 ? void 0 : room.players) === null || _a === void 0 ? void 0 : _a.find(player => player.id === playerId);
            console.log(room);
            if (!player) {
                return {
                    status: "error",
                    message: "Invalid action",
                    error: "Player not found",
                    code: 400
                };
            }
            return {
                status: "success",
                message: "Player joined successfully",
                data: {
                    nextUpdates: nextUpdates.READY,
                    players: (room === null || room === void 0 ? void 0 : room.players) || []
                },
                code: 1
            };
        case 'start-game':
            if (room === undefined) {
                return {
                    status: "error",
                    message: "Invalid action",
                    error: "Room not found",
                    code: 400
                };
            }
            (_b = room.players) === null || _b === void 0 ? void 0 : _b.forEach(player => pokerGame.addPlayer(player));
            const playersSorted = pokerGame.sortPlayers();
            pokerGame.dealerStartGame();
            return {
                status: "success",
                message: "Game started, All players are added, sorted and dealers have shuffled their cards",
                data: {
                    sortedPlayers: playersSorted,
                    nextUpdate: nextUpdates.SMALL_BLIND_UPDATE
                },
                code: 2
            };
        // pre flop done
        case 'small-binding-update':
            const smallBlind = pokerGame.smallBindUpdate(smallBlindValue);
            return {
                status: "success",
                message: smallBlind.message,
                data: {
                    smallBlindValue: smallBlindValue,
                    nextUpdates: nextUpdates.BIG_BLIND_UPDATE
                },
                code: 3
            };
        case 'big-blind-update':
            const bigBlind = pokerGame.bigBindUpdate(bigBlindValue);
            return {
                status: "success",
                message: bigBlind.message,
                data: {
                    bigBlindValue: bigBlindValue,
                    nextUpdates: nextUpdates.BET
                },
                code: 4
            };
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
                data: response,
                code: 5
            };
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
                        },
                        code: 6
                    };
                }
            }
            else {
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
                    },
                    code: 6
                };
            }
            if (isPreFlop) {
                pokerGame.dealAtTheTable(true);
            }
            else {
                pokerGame.dealAtTheTable(false);
            }
            return {
                status: "success",
                message: message,
                data: {
                    nextUpdate: nextUpdates.BET,
                    code: code
                },
                code: 7
            };
        // ill send the response to the client, every client will then request to get cards
    }
    return {
        status: "error",
        message: "Invalid action",
        error: "Invalid action",
        code: 400
    };
};
exports.handlePokerAction = handlePokerAction;
