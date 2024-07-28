import { Card, gameFormat } from "./Card";
import { Dealer } from "./Dealer";
import { HandEvaluator } from "./HandEvaluator";
import { Player } from "./Player";
import { askForNoOfPlayers, askForPlayerDetails } from "./promptValueSchema";

type PokerMoney = 5 | 10 | 15 | 25 | 50 | 100;
type BetMessageWhenBetSet = "raise" | "call" | "fold" | "all-in";
type BetMessageWhenNoBetSet = "check" | "bet";

export class Poker {

    private dealer: Dealer;
    private players: Player[];
    private gameFormat: gameFormat
    private playerBets: Map<string, number>;
    private playerRankings: Map<string, number>;
    private currentStake: number;
    private totalMoneySpent: number;
    private currentPlayerIndex: number;
    private communityCards: Card[];
    private playerChecked: Map<string, boolean>;
    constructor(gameFormat: gameFormat) {
        this.dealer = new Dealer();
        this.players = [];
        this.gameFormat = gameFormat;
        this.playerBets = new Map();
        this.currentStake = 0;
        this.currentPlayerIndex = 0;
        this.communityCards = [];
        this.totalMoneySpent = 0;
        this.playerRankings = new Map();
        this.playerChecked = new Map();
    }
    getCommunityCards() {
        return this.communityCards;
    }

    getCurrentPlayerId(): string {
        return this.players[this.currentPlayerIndex].id;
    }

    getCurrentStake(): number {
        return this.currentStake;
    }

    getCards(playerId: string): Card[] {
        const player = this.players.find(player => player.id === playerId);
        if (player) {
            return player.hand;
        }
        return [];
    }

    async addAllPlayers() {
        const noOfPlayers = await askForNoOfPlayers();
        for (let i = 0; i < noOfPlayers; i++) {
            const { name, balance } = await askForPlayerDetails();
            const newPlayer = new Player(name, balance);
            this.addPlayer(newPlayer);
        }
    }
    addPlayerUpdate(player: Player) {
        if (this.players.length >= 6) {
            return {
                code: 4,
                message: "Cannot add more players only 6 allowed"
            }
        }
        this.players.push(player);
        return {
            code: 5,
            message: "Player added successfully"
        }
    }
    addPlayer(player: Player) {
        try {
            this.players.push(player);
            if (this.players.length > 5) {
                return {
                    code: 4,
                    message: "Cannot add more players only 6 allowed"
                }
            }
        } catch (Error) {
            console.log("Cannot add more players only 6 allowed")
        }
    }
    sortPlayers() {
        this.players.sort((a, b) => {
            return a.addedTime.getTime() - b.addedTime.getTime();
        });
        return this.players;
    }
    dealerStartGame() {
        this.dealer.sortDeck();
        this.dealer.shuffle();
    }
    async start() {
        // add players
        await this.addAllPlayers();
        this.sortPlayers();
        this.dealer.sortDeck();
        this.dealer.shuffle();
        if (this.gameFormat === "TexasHoldem") {
            await this.startTexasGame();
        }
    }
    displayWinner() {
        const winner = this.predictWinner();
        console.log(`Winner is ${winner}`)
        console.log(`Total money won ${this.totalMoneySpent}`)
        winner.balance += this.totalMoneySpent;
        return winner;
    }
    async startTexasGame() {

        //deal whole cards
        console.log("Starting the game")
        this.preFlop();
        console.log("Pre flop done")
        console.log("Calling blinds")
        // call blinds
        await this.callBlinds();
        console.log("Blinds called")
        console.log("Place a bet")
        // place a bet
        const responseOne = await this.bet();
        if (responseOne) {
            this.displayWinner()
            return;
        }
        console.log("Bet placed")
        console.log("Deal at the table")
        // flop
        this.dealAtTheTable(true);
        // post flop betting round
        console.log("Place a bet")
        const responseTwo = await this.bet();
        if (responseTwo) {
            this.displayWinner()
            return;
        }

        console.log("Bet placed")
        console.log("Deal at the table")
        //  Now put a card on the table
        this.dealAtTheTable(false);
        // bet again
        console.log("Place a bet")
        const responseThree = await this.bet();
        if (responseThree) {
            this.displayWinner()
            return;
        }

        console.log("Bet placed")
        console.log("Deal at the table")
        // put river card at table
        this.dealAtTheTable(false);
        // bet final time
        console.log("Place a bet river")
        const responseFour = await this.bet();
        if (responseFour) {
            this.displayWinner()
            return;
        }

        console.log("Bet placed")
        console.log("Showdown")
        // showdown
        this.displayWinner()
        return;

    }
    smallBindUpdate(amount: number) {
        const smallBindValue = amount;
        this.playerBets.set(this.players[this.currentPlayerIndex].id, smallBindValue)
        this.currentPlayerIndex += 1;
        return {
            code: 4,
            message: "Small blind placed"
        }
    }
    bigBindUpdate(amount: number) {
        const bigBlindValue = amount;
        this.playerBets.set(this.players[this.currentPlayerIndex].id, bigBlindValue)
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.currentStake = bigBlindValue;
        return {
            code: 5,
            message: "Big blind placed"
        }
    }
    updateCurrentPlayerIndex() {
        this.currentPlayerIndex = 0;
    }
    updatePlayerBets() {
        [...this.playerBets.values()].forEach(value => this.totalMoneySpent += value)
        this.playerBets.clear();
    }
    updateCheckedStatus() {
        this.playerChecked.forEach((_value, key) => {
            this.playerChecked.set(key, false);
        })
    }
    checkConsistency() {
        const value = [...this.playerBets.values()].every((a) => a === this.currentStake);
        if (value) {
            return true;
        }
        return false;
    }

    betUpdateOnNoBetSet(message: BetMessageWhenNoBetSet, money: PokerMoney) {
        if (message === "check") {
            this.playerChecked.set(this.players[this.currentPlayerIndex].id, true);
            const value = [...this.playerChecked.values()].reduce((a, b) => a && b);
            if (value) {
                this.updateCheckedStatus();
                this.updatePlayerBets();
                this.updateCurrentPlayerIndex()
                return {
                    code: 12,
                    message: "Every Player has checked, move to next round"
                }
            }
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            return {
                code: 11,
                message: "Checked"
            }
        } else {
            // const isLastPlayer = [...this.playerBets.values()] // iterate through the map to see if he is the only one left to bet or checked
            this.playerBets.set(this.players[this.currentPlayerIndex].id, money);
            this.currentStake = money;
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            return {
                code: 10,
                message: "Bet placed"
            }
        }
    }

    betUpdateOnPrevBet(message: BetMessageWhenBetSet, money: PokerMoney) {
        switch (message) {
            case "raise":
            case "call":
                this.playerBets.set(this.players[this.currentPlayerIndex].id, money);
                this.currentStake = money;
                // check if every player has betted same money or not
                let everyPlayerBetSame = this.checkConsistency();
                if (everyPlayerBetSame) {
                    this.updateCheckedStatus();
                    this.updatePlayerBets();
                    this.updateCurrentPlayerIndex()
                    return {
                        code: 2,
                        message: "Move to next round"
                    }
                }
                return {
                    code: 9,
                    message: "Call placed"
                }
            case "fold":
                this.players[this.currentPlayerIndex].fold();
                this.players.splice(this.currentPlayerIndex, 1);
                if (this.players.length <= 1) {
                    const winner = this.displayWinner();
                    return {
                        code: 1,
                        message: "Game over",
                        winner: winner
                    }
                }
                everyPlayerBetSame = this.checkConsistency();
                if (everyPlayerBetSame) {
                    this.updateCheckedStatus();
                    this.updatePlayerBets();
                    this.updateCurrentPlayerIndex()
                    return {
                        code: 3,
                        message: "Folded, Move to next round"
                    }
                }
                this.currentPlayerIndex = (this.currentPlayerIndex === 0 ? this.players.length : this.currentPlayerIndex) - 1;

                return {
                    code: 7,
                    message: "Folded"
                }
            case "all-in":
                this.playerBets.set(this.players[this.currentPlayerIndex].id, money);
                if (this.currentStake < money) {
                    this.currentStake = money;
                }
                return {
                    code: 8,
                    message: "All in"
                }
        }

    }

    async callBlinds() {
        // first player will bid a small amount
        // second will bid a big amount
        // then game will go to third player
        // he can choose diff actions
        const smallBindValue = await this.players[this.currentPlayerIndex].smallBlind();
        this.playerBets.set(this.players[this.currentPlayerIndex].id, smallBindValue)
        this.currentPlayerIndex += 1;
        //ask prompt to choose small blind
        const bigBlindValue = await this.players[this.currentPlayerIndex].bigBlind(smallBindValue);
        this.playerBets.set(this.players[this.currentPlayerIndex].id, bigBlindValue)
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        this.currentStake = bigBlindValue;
        //ask prompt to choose big blind

    }
    async bet() {

        console.log("Community cards are")
        this.communityCards.forEach(card => console.log(card))
        let hasBetBeenMade = this.currentStake !== 0;
        let everyOneAtSameLevel = false;
        const hasChecked = new Map(this.players.map(player => [player.id, false])); // Tracking checks

        while (!everyOneAtSameLevel) {
            let currentPlayer = this.players[this.currentPlayerIndex];
            console.log("Current player is", this.players[this.currentPlayerIndex].name)
            this.players[this.currentPlayerIndex].hand.forEach(card => console.log(card))

            if (this.players.length === 1) {
                return true;
            }

            if (currentPlayer.hasFolded || currentPlayer.hasDoneAllIn) {
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
                continue;
            }

            const { message, value } = await currentPlayer.askForAction(this.currentStake);
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
                    break
                // value is 0 meaning ignore it
                case "called":
                    if (!hasBetBeenMade) {
                        console.error("Cannot call when no bet has been made");
                        continue;
                    }
                    this.playerBets.set(currentPlayer.id, value);
                    hasChecked.clear();
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
                    hasChecked.clear();
                    break;
                case "raised":
                    if (!hasBetBeenMade) {
                        console.error("Cannot raise when no bet has been made");
                        continue;
                    }
                    this.playerBets.set(currentPlayer.id, value);
                    // value is greater than current stake
                    this.currentStake = value;
                    hasChecked.clear();
                    break;
                case "all-in":
                    this.playerBets.set(currentPlayer.id, value);
                    // if he goes all in we can increase the current stake
                    if (this.currentStake < value) {
                        this.currentStake = value;
                    }
                    hasBetBeenMade = true;
                    hasChecked.clear();
                    break;
                case "checked":
                    if (hasBetBeenMade) {
                        console.error("Cannot check in preflop or when a bet has been made");
                        continue;
                    }
                    hasChecked.set(currentPlayer.id, true);
                    // No action needed for check
                    break;
                default:
                    console.error("Unexpected action type received");
                    continue;
            }

            // increment iterator
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            console.log(this.playerBets)
            console.log(this.currentStake)
            everyOneAtSameLevel = this.players.every(player =>
                player.hasFolded ||
                player.hasDoneAllIn ||
                this.playerBets.get(player.id) === this.currentStake ||
                (!hasBetBeenMade && player.hasChecked)
            );

            const arr = [...hasChecked.values()]
            if (arr.length)
                everyOneAtSameLevel = arr.length > 0 && arr.every(v => v) && !hasBetBeenMade;

        }

        this.currentPlayerIndex = 0;
        this.players.forEach(player => player.hasChecked = false);
        [...this.playerBets.values()].forEach(value => this.totalMoneySpent += value)
        this.playerBets.clear();
    }
    dealAtTheTable(preFlop: Boolean) {
        if (preFlop) {
            this.communityCards.push(this.dealer.deal());
            this.communityCards.push(this.dealer.deal());
            this.communityCards.push(this.dealer.deal());
        } else {
            this.communityCards.push(this.dealer.deal());
        }
        this.currentStake = 0;
    }
    dealCardsToPlayers(times: number) {
        for (let i = 0; i < times; i++) {
            this.players.forEach(player => {
                player.addCard(this.dealer.deal());
            })
        }
    }
    preFlop() {
        this.dealer.shuffle();
        this.dealCardsToPlayers(2);
    }
    rankPlayers() {
        const playerScores = this.players.map(player => {
            const { score, tiebreaker, comparison } = HandEvaluator.calculateScore(player.hand, this.communityCards);
            return { player, score, tiebreaker, comparison };
        });

        playerScores.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score;
            }
            return HandEvaluator.compareCardsOfSameTieBreaker(b.tiebreaker, a.tiebreaker, a.comparison);
        });

        this.playerRankings = new Map(
            playerScores.map((playerScore, index) => [playerScore.player.id, index + 1])
        );
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

    toString(): string {
        let result = `Poker game with ${this.players.length} players`;
        result += `\nCommunity cards: ${this.communityCards.join(', ')}`;
        return result;
    }
}

