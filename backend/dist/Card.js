"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = exports.Card = void 0;
class Card {
    constructor(suite, value) {
        this.suite = suite;
        this.value = value;
        this.rank = this.calculateRank(value);
    }
    compare(other) {
        if (this.rank !== other.rank) {
            return this.rank - other.rank;
        }
        // If ranks are the same, optionally compare by suite
        const suiteOrder = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
        return suiteOrder.indexOf(this.suite) - suiteOrder.indexOf(other.suite);
    }
    calculateRank(value) {
        const order = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        return order.indexOf(value) + 2; // '+2' because in poker '2' is the lowest rank and 'Ace' can be high
    }
    getValue() {
        return this.value;
    }
    getSuite() {
        return this.suite;
    }
    getRank() {
        return this.rank;
    }
}
exports.Card = Card;
class Deck {
    constructor() {
        this.rankedSuites = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
        this.rankedValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        this.cards = [];
        this.sortDeck();
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    deal() {
        if (this.cards.length === 0) {
            throw new Error("No more cards in the deck");
        }
        const card = this.cards.pop();
        if (card === undefined) {
            throw new Error("Unexpected undefined card");
        }
        return card;
    }
    sortDeck() {
        this.cards = [];
        for (const suite of this.rankedSuites) {
            for (const value of this.rankedValues) {
                this.cards.push(new Card(suite, value));
            }
        }
    }
}
exports.Deck = Deck;
