"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dealer = void 0;
const Card_1 = require("./Card");
class Dealer {
    constructor() {
        this.deck = new Card_1.Deck();
        this.deck.shuffle();
    }
    deal() {
        return this.deck.deal();
    }
    shuffle() {
        this.deck.shuffle();
    }
    sortDeck() {
        this.deck.sortDeck();
    }
}
exports.Dealer = Dealer;
