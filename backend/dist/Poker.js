"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poker = void 0;
const Dealer_1 = require("./Dealer");
const HandEvaluator_1 = require("./HandEvaluator");
const Player_1 = require("./Player");
const promptValueSchema_1 = require("./promptValueSchema");
class Poker {
    static createInstance(gameFormat) {
        if (Poker.instance === null) {
            Poker.instance = new Poker(gameFormat);
        }
        return Poker.instance;
    }
    constructor(gameFormat) {
        this.dealer = new Dealer_1.Dealer();
        this.players = [];
        this.gameFormat = gameFormat;
        this.playerBets = new Map();
        this.currentStake = 0;
        this.currentPlayerIndex = 0;
        this.communityCards = [];
        this.totalMoneySpent = 0;
        this.playerRankings = new Map();
    }
    addAllPlayers() {
        return __awaiter(this, void 0, void 0, function* () {
            const noOfPlayers = yield (0, promptValueSchema_1.askForNoOfPlayers)();
            for (let i = 0; i < noOfPlayers; i++) {
                const { name, balance } = yield (0, promptValueSchema_1.askForPlayerDetails)();
                const newPlayer = new Player_1.Player(name, balance);
                this.addPlayer(newPlayer);
            }
        });
    }
    addPlayer(player) {
        try {
            this.players.push(player);
            if (this.players.length > 5) {
                throw new Error("Too many players");
            }
        }
        catch (Error) {
            console.log("Cannot add more players only 6 allowed");
        }
    }
    sortPlayers() {
        this.players.sort((a, b) => {
            return a.addedTime.getTime() - b.addedTime.getTime();
        });
    }
    start() {
        // add players
        this.addAllPlayers();
        this.sortPlayers();
        this.dealer.sortDeck();
        this.dealer.shuffle();
        if (this.gameFormat === "TexasHoldem") {
            this.startTexasGame();
        }
    }
    startTexasGame() {
        return __awaiter(this, void 0, void 0, function* () {
            //deal whole cards
            console.log("Starting the game");
            this.preFlop();
            console.log("Pre flop done");
            console.log("Calling blinds");
            // call blinds
            yield this.callBlinds();
            console.log("Blinds called");
            console.log("Place a bet");
            // place a bet
            this.bet();
            console.log("Bet placed");
            console.log("Deal at the table");
            // flop
            this.dealAtTheTable(true);
            // post flop betting round
            console.log("Place a bet");
            this.bet();
            console.log("Bet placed");
            console.log("Deal at the table");
            //  Now put a card on the table
            this.dealAtTheTable(false);
            // bet again
            console.log("Place a bet");
            this.bet();
            console.log("Bet placed");
            console.log("Deal at the table");
            // put river card at table
            this.dealAtTheTable(false);
            // bet final time
            console.log("Place a bet river");
            this.bet();
            console.log("Bet placed");
            console.log("Showdown");
            // showdown
            const winner = this.predictWinner();
            console.log(`Winner is ${winner}`);
        });
    }
    callBlinds() {
        return __awaiter(this, void 0, void 0, function* () {
            // first player will bid a small amount
            // second will bid a big amount
            // then game will go to third player
            // he can choose diff actions
            const smallBindValue = yield this.players[this.currentPlayerIndex].smallBlind();
            this.playerBets.set(this.players[this.currentPlayerIndex].id, smallBindValue);
            //ask prompt to choose small blind
            const bigBlindValue = yield this.players[this.currentPlayerIndex + 1].bigBlind(smallBindValue);
            this.playerBets.set(this.players[this.currentPlayerIndex + 1].id, bigBlindValue);
            this.currentStake = bigBlindValue;
            //ask prompt to choose big blind
            this.currentPlayerIndex += 2;
        });
    }
    bet() {
        return __awaiter(this, void 0, void 0, function* () {
            let hasBetBeenMade = this.currentStake !== 0;
            let everyOneAtSameLevel = false;
            while (!everyOneAtSameLevel) {
                let currentPlayer = this.players[this.currentPlayerIndex];
                if (currentPlayer.hasFolded || currentPlayer.hasDoneAllIn) {
                    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
                    continue;
                }
                const { message, value } = yield currentPlayer.askForAction(this.currentStake);
                // value is the balance that has been returned.
                if (value === -1) {
                    console.error("Invalid action, please try again");
                    continue;
                }
                switch (message) {
                    case "folded":
                        this.players.splice(this.currentPlayerIndex, 1);
                        if (this.players.length <= 1) {
                            everyOneAtSameLevel = true; // Only one player remaining
                            break;
                        }
                        this.currentPlayerIndex = (this.currentPlayerIndex === 0 ? this.players.length : this.currentPlayerIndex) - 1;
                        break;
                    // value is 0 meaning ignore it
                    case "called":
                        if (!hasBetBeenMade) {
                            console.error("Cannot call when no bet has been made");
                            continue;
                        }
                        this.playerBets.set(currentPlayer.id, value);
                        // value is same as current stake
                        break;
                    case "bet":
                        if (hasBetBeenMade) {
                            console.error("Cannot bet when bet has been made try call or raise");
                            continue;
                        }
                        this.playerBets.set(currentPlayer.id, value);
                        this.currentStake = value;
                        hasBetBeenMade = true;
                        break;
                    case "raised":
                        if (!hasBetBeenMade) {
                            console.error("Cannot raise when no bet has been made");
                            continue;
                        }
                        this.playerBets.set(currentPlayer.id, value);
                        // value is greater than current stake
                        this.currentStake = value;
                        break;
                    case "all-in":
                        this.playerBets.set(currentPlayer.id, value);
                        // if he goes all in we can increase the current stake
                        if (this.currentStake < value) {
                            this.currentStake = value;
                        }
                        hasBetBeenMade = true;
                        break;
                    case "checked":
                        if (hasBetBeenMade) {
                            console.error("Cannot check in preflop or when a bet has been made");
                            continue;
                        }
                        // No action needed for check
                        break;
                    default:
                        console.error("Unexpected action type received");
                        continue;
                }
                // increment iterator
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
                everyOneAtSameLevel = this.players.every(player => player.hasFolded || player.hasDoneAllIn || this.playerBets.get(player.id) === this.currentStake || (!hasBetBeenMade && player.hasChecked));
            }
            this.currentPlayerIndex = 0;
            this.players.forEach(player => player.hasChecked = false);
        });
    }
    dealAtTheTable(preFlop) {
        if (preFlop) {
            this.communityCards.push(this.dealer.deal());
            this.communityCards.push(this.dealer.deal());
            this.communityCards.push(this.dealer.deal());
        }
        else {
            this.communityCards.push(this.dealer.deal());
        }
        this.currentStake = 0;
    }
    dealCardsToPlayers(times) {
        for (let i = 0; i < times; i++) {
            this.players.forEach(player => {
                player.addCard(this.dealer.deal());
            });
        }
    }
    preFlop() {
        this.dealer.shuffle();
        this.dealCardsToPlayers(2);
    }
    rankPlayers() {
        const playerScores = this.players.map(player => {
            const { score, tiebreaker, comparison } = HandEvaluator_1.HandEvaluator.calculateScore(player.hand, this.communityCards);
            return { player, score, tiebreaker, comparison };
        });
        playerScores.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score;
            }
            return HandEvaluator_1.HandEvaluator.compareCardsOfSameTieBreaker(b.tiebreaker, a.tiebreaker, a.comparison);
        });
        this.playerRankings = new Map(playerScores.map((playerScore, index) => [playerScore.player.id, index + 1]));
    }
    predictWinner() {
        this.rankPlayers();
        let winner = this.players[0];
        let highestRank = Number.MAX_SAFE_INTEGER;
        this.players.forEach(player => {
            const rank = this.playerRankings.get(player.id);
            if (rank !== undefined && rank < highestRank) {
                highestRank = rank;
                winner = player;
            }
        });
        return winner;
    }
}
exports.Poker = Poker;
Poker.instance = null;
