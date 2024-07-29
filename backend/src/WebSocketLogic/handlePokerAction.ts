import { Player } from "../gameLogic/Player";
import { Poker } from "../gameLogic/Poker";
import { PokerState } from "../gameLogic/pokerState";
import { getRoom } from "../roomLogic/createRoom";

interface Response {
    status: "success" | "error";
    message: string;
    data?: any;
    error?: string;
    code: number;
}

enum nextUpdates {
    READY = "READY",
    START_GAME = "START_GAME",
    SMALL_BLIND_UPDATE = "SMALL_BLIND_UPDATE",
    BIG_BLIND_UPDATE = "BIG_BLIND_UPDATE",
    BET = "BET",
    GET_CARDS = "GET_CARDS",
    END_GAME = "END_GAME"
}


interface GameStatusDetails {
    message: string;
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

const handlePokerAction = (message: string): Response => {
    const { action, payload } = JSON.parse(message);
    const { betMessage, betAmount, playerId, isPreFlop, isRiver, smallBlindValue, bigBlindValue, roomId, nextStep } = payload;
    let pokerGame = PokerState.getInstance().getPokerGame(roomId);
    const room = getRoom(roomId);
    switch (action) {
        case 'player-join':
            const player = room?.players?.find(player => player.id === playerId)
            if (!player) {
                return {
                    status: "error",
                    message: "Invalid action",
                    error: "Player not found",
                    code: 400
                }
            }
            if (room?.players?.length === room?.numberOfPlayers) {
                return {
                    status: "success",
                    message: "Player joined successfully",
                    data: {
                        nextUpdates: nextUpdates.READY,
                        players: room?.players || [],
                        canStart: true
                    },
                    code: 1
                }
            }
            return {
                status: "success",
                message: "Player joined successfully",
                data: {
                    nextUpdates: nextUpdates.READY,
                    players: room?.players || [],
                    canStart: false
                },
                code: 1
            }
        case 'start-game':
            if (room === undefined) {
                return {
                    status: "error",
                    message: "Invalid action",
                    error: "Room not found",
                    code: 400
                }
            }
            if (pokerGame) {
                return {
                    status: "error",
                    message: "Invalid action",
                    error: "Game already started",
                    code: 400
                }
            }
            const newPokerGame = PokerState.getInstance().createPokerGame(room.roomId)
            room.players?.forEach(player => newPokerGame.addPlayer(player));
            const playersSorted = newPokerGame.sortPlayers();
            newPokerGame.dealerStartGame()
            let nextPlayerForSmallBlindId = newPokerGame.getCurrentPlayerId()
            return {
                status: "success",
                message: "Game started, All players are added, sorted and dealers have shuffled their cards",
                data: {
                    sortedPlayers: playersSorted,
                    nextUpdate: nextUpdates.SMALL_BLIND_UPDATE,
                    nextPlayerId: nextPlayerForSmallBlindId
                },
                code: 2
            }
        // pre flop done
        case 'small-binding-update':

            if (!pokerGame) return {
                status: "error",
                message: "Invalid action",
                error: "Poker game not found",
                code: 400
            }
            const smallBlind = pokerGame.smallBindUpdate(smallBlindValue);
            let nextPlayerForBigBlindId = pokerGame.getCurrentPlayerId()
            return {
                status: "success",
                message: smallBlind.message,
                data: {
                    smallBlindValue: smallBlindValue,
                    nextUpdates: nextUpdates.BIG_BLIND_UPDATE,
                    nextPlayerId: nextPlayerForBigBlindId
                },
                code: 3
            }
        case 'big-blind-update':
            if (!pokerGame) return {
                status: "error",
                message: "Invalid action",
                error: "Poker game not found",
                code: 400
            }
            const bigBlind = pokerGame.bigBindUpdate(bigBlindValue);
            let nextPlayerForBetId = pokerGame.getCurrentPlayerId()
            return {
                status: "success",
                message: bigBlind.message,
                data: {
                    bigBlindValue: bigBlindValue,
                    nextUpdates: nextUpdates.BET,
                    nextPlayerId: nextPlayerForBetId
                },
                code: 4
            }
        // forced binds done
        case "get-cards":
            if (!pokerGame) return {
                status: "error",
                message: "Invalid action",
                error: "Poker game not found",
                code: 400
            }
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
            }
        case 'bet':
            let code = 0, message = "";
            if (!pokerGame) return {
                status: "error",
                message: "Invalid action",
                error: "Poker game not found",
                code: 400
            }
            let currentStake = pokerGame.getCurrentStake();
            if (currentStake !== 0) {
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
                    },
                    code: 6
                }
            }
            if (isPreFlop) {
                pokerGame.dealAtTheTable(true);
            } else {
                pokerGame.dealAtTheTable(false);
            }
            let nextPlayerId = pokerGame.getCurrentPlayerId()
            currentStake = pokerGame.getCurrentStake();
            let myPlayerCards = pokerGame.getCards(playerId).map(card => card.getValue() + ':' + card.getSuite());
            let theCommunityCards = pokerGame.getCommunityCards().map(card => card.getValue() + ':' + card.getSuite());
            return {
                status: "success",
                message: message,
                data: {
                    nextUpdate: nextUpdates.BET,
                    code: code,
                    nextPlayerId: nextPlayerId,
                    currentStake: currentStake,
                    playerCards: myPlayerCards,
                    communityCards: theCommunityCards
                },
                code: 7
            }
        // ill send the response to the client, every client will then request to get cards
    }
    return {
        status: "error",
        message: "Invalid action",
        error: "Invalid action",
        code: 400
    }
};



export {
    handlePokerAction
}