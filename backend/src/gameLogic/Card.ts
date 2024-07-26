

export type CardSuite = 'Spades' | 'Hearts' | 'Diamonds' | 'Clubs';
export type CardValue = 'Ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King';


export class Card {
    private suite: CardSuite;
    private value: CardValue;
    private rank: number;
    constructor(suite: CardSuite, value: CardValue) {
        this.suite = suite;
        this.value = value;
        this.rank = this.calculateRank(value);
    }
    compare(other: Card): number {
        if (this.rank !== other.rank) {
            return this.rank - other.rank;
        }
        // If ranks are the same, optionally compare by suite
        const suiteOrder = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
        return suiteOrder.indexOf(this.suite) - suiteOrder.indexOf(other.suite);
    }

    private calculateRank(value: CardValue): number {
        const order = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        return order.indexOf(value) + 2; // '+2' because in poker '2' is the lowest rank and 'Ace' can be high
    }

    getValue(): CardValue {
        return this.value;
    }
    getSuite(): CardSuite {
        return this.suite;
    }
    getRank(): number {
        return this.rank;
    }

    toString(): string {
        return `[${this.value} of ${this.suite}]`;
    }

}

export class Deck {
    private cards: Card[];
    private rankedSuites: CardSuite[] = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    private rankedValues: CardValue[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    constructor() {
        this.cards = [];
        this.sortDeck();
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    deal(): Card {
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


export type gameFormat = "TexasHoldem"





