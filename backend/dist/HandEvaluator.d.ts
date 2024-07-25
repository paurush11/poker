import { Card } from "./Card";
export type CardComparison = "Royal Flush" | "Straight Flush" | "Four of a Kind" | "Full House" | "Flush" | "Straight" | "Three of a Kind" | "Two Pair" | "One Pair" | "High Card";
export declare class HandEvaluator {
    constructor();
    /**
     * Calculates the score of a given hand and community cards.
     * @param hand The player's hand.
     * @param communityCards The community cards.
     * @returns The score of the hand.
     */
    /**
     * Calculates the score of a given hand and community cards.
     * @param hand The player's hand.
     * @param communityCards The community cards.
     * @returns The score of the hand.
     */
    static compareCardsOfSameTieBreaker(cardsOne: Card[], cardsTwo: Card[], comparison: CardComparison): number;
    static calculateScore(hand: Card[], communityCards: Card[]): {
        score: number;
        tiebreaker: Card[];
        comparison: CardComparison;
    };
    private static compareSequentially;
    private static getHighCards;
    private static isRoyalFlush;
    private static isFlush;
    private static isStraightFlush;
    private static isStraight;
    private static isFourOfAKind;
    private static isFullHouse;
    private static isThreeOfAKind;
    private static isTwoPair;
    private static isPair;
    private static groupByValue;
    private static groupBySuite;
}
