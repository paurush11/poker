import { Deck } from "./Card";

export class Dealer {
    private deck: Deck;
    constructor() {
        this.deck = new Deck();
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
