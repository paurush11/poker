export type CardSuite = 'Spades' | 'Hearts' | 'Diamonds' | 'Clubs';
export type CardValue = 'Ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King';
export declare class Card {
    private suite;
    private value;
    private rank;
    constructor(suite: CardSuite, value: CardValue);
    compare(other: Card): number;
    private calculateRank;
    getValue(): CardValue;
    getSuite(): CardSuite;
    getRank(): number;
    toString(): string;
}
export declare class Deck {
    private cards;
    private rankedSuites;
    private rankedValues;
    constructor();
    shuffle(): void;
    deal(): Card;
    sortDeck(): void;
}
export type gameFormat = "TexasHoldem";
