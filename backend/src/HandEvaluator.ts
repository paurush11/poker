import { Card, CardSuite, CardValue } from "./Card";

export type CardComparison = "Royal Flush" | "Straight Flush" | "Four of a Kind" | "Full House" | "Flush" | "Straight" | "Three of a Kind" | "Two Pair" | "One Pair" | "High Card"
export class HandEvaluator {

    constructor() { }
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

    static compareCardsOfSameTieBreaker(cardsOne: Card[], cardsTwo: Card[], comparison: CardComparison) {
        switch (comparison) {
            case "Royal Flush":
                return 0;
            case "Straight Flush":
            case "Straight":
            case "Flush":
                return this.compareSequentially(cardsTwo, cardsOne);
            case "Four of a Kind":
                let fourOfAKindCompare = cardsTwo[0].compare(cardsOne[0]);
                if (fourOfAKindCompare !== 0) return fourOfAKindCompare;
                return cardsTwo[4].compare(cardsOne[4]);
            case "Full House":
                let threeOfAKindCompare = cardsTwo[0].compare(cardsOne[0]);
                if (threeOfAKindCompare !== 0) return threeOfAKindCompare;
                return cardsTwo[3].compare(cardsOne[3]);
            case "Three of a Kind":
                let tripleCompare = cardsTwo[0].compare(cardsOne[0]);
                if (tripleCompare !== 0) return tripleCompare;
                return this.compareSequentially(cardsTwo.slice(3), cardsOne.slice(3));
            case "Two Pair":
                let higherPairCompare = cardsTwo[0].compare(cardsOne[0]);
                if (higherPairCompare !== 0) return higherPairCompare;
                let lowerPairCompare = cardsTwo[2].compare(cardsOne[2]);
                if (lowerPairCompare !== 0) return lowerPairCompare;
                return cardsTwo[4].compare(cardsOne[4]);
            case "One Pair":
                let pairCompare = cardsTwo[0].compare(cardsOne[0]);
                if (pairCompare !== 0) return pairCompare;
                return this.compareSequentially(cardsTwo.slice(2), cardsOne.slice(2));
            case "High Card":
                return this.compareSequentially(cardsTwo, cardsOne);
            default:
                throw new Error("Invalid comparison type");
        }
    }


    static calculateScore(hand: Card[], communityCards: Card[]): {
        score: number,
        tiebreaker: Card[],
        comparison: CardComparison
    } {
        const allCards = [...hand, ...communityCards];

        const royalFlush = this.isRoyalFlush(allCards);
        if (royalFlush && royalFlush.length) return { score: 10, tiebreaker: royalFlush, comparison: "Royal Flush" };

        const straightFlush = this.isStraightFlush(allCards);
        if (straightFlush && straightFlush.length) return { score: 9, tiebreaker: straightFlush, comparison: "Straight Flush" };

        const fourOfAKind = this.isFourOfAKind(allCards);
        if (fourOfAKind && fourOfAKind.length) return { score: 8, tiebreaker: fourOfAKind, comparison: "Four of a Kind" };

        const fullHouse = this.isFullHouse(allCards);
        if (fullHouse && fullHouse.length) return { score: 7, tiebreaker: fullHouse, comparison: "Full House" };

        const flush = this.isFlush(allCards);
        if (flush && flush.length) return { score: 6, tiebreaker: flush, comparison: "Flush" };

        const straight = this.isStraight(allCards);
        if (straight && straight.length) return { score: 5, tiebreaker: straight, comparison: "Straight" };

        const threeOfAKind = this.isThreeOfAKind(allCards);
        if (threeOfAKind && threeOfAKind.length) return { score: 4, tiebreaker: threeOfAKind, comparison: "Three of a Kind" };

        const twoPair = this.isTwoPair(allCards);
        if (twoPair && twoPair.length) return { score: 3, tiebreaker: twoPair, comparison: "Two Pair" };

        const pair = this.isPair(allCards);
        if (pair && pair.length) return { score: 2, tiebreaker: pair, comparison: "One Pair" };

        return { score: 1, tiebreaker: this.getHighCards(allCards), comparison: "High Card" };

    }
    private static compareSequentially(cardsOne: Card[], cardsTwo: Card[]) {
        for (let i = 0; i < cardsOne.length; i++) {
            const comparison = cardsOne[i].compare(cardsTwo[i]);
            if (comparison !== 0) return comparison;
        }
        return 0;
    }
    private static getHighCards(cards: Card[]): Card[] {
        // Implementation for getting high cards
        return cards.sort((a, b) => b.compare(a)) // set of all high cards
    }

    private static isRoyalFlush(cards: Card[]): Card[] {
        const flush = this.isFlush(cards).slice(0, 5);

        if (flush && flush.every(card => ['10', 'Jack', 'Queen', 'King', 'Ace'].includes(card.getValue()))) {
            return flush;
        }
        return [];
    }
    private static isFlush(cards: Card[]): Card[] {
        const grouped = this.groupBySuite(cards);

        for (const group of grouped.values()) {
            if (group.length >= 5) {
                return this.getHighCards(group)
            }
        }
        return [];
    }

    private static isStraightFlush(cards: Card[]): Card[] {
        const flush = this.isFlush(cards);
        if (flush && flush.length > 0 && this.isStraight(flush).length > 0) {
            return flush;
        }
        return [];
    }
    private static isStraight(cards: Card[]): Card[] {
        // Extract unique ranks and sort them in ascending order for easier sequential checking
        const uniqueRanks = [...new Set(cards.map(c => c.getRank()))].sort((a, b) => a - b);
        let straightCount = 1;
        let straightCards: Card[] = [];

        for (let i = 0; i < uniqueRanks.length - 1; i++) {
            // Check if the next rank is consecutive
            if (uniqueRanks[i + 1] === uniqueRanks[i] + 1) {
                straightCount++;
                if (straightCount === 1) { // Start a new potential straight sequence
                    straightCards = [cards.find(c => c.getRank() === uniqueRanks[i])!];
                }
                straightCards.push(cards.find(c => c.getRank() === uniqueRanks[i + 1])!);
            } else {
                // Reset if not consecutive
                if (straightCount >= 5) {
                    return straightCards;
                }
                straightCount = 1;
                straightCards = [];
            }
        }

        // Successfully identified a straight of at least 5 cards
        if (straightCount >= 5) {
            return straightCards;
        }

        // Special case: Check for Ace-low straight (A, 2, 3, 4, 5)
        if (uniqueRanks.includes(14) && uniqueRanks.includes(2) && uniqueRanks.includes(3) && uniqueRanks.includes(4) && uniqueRanks.includes(5)) {
            straightCards = cards.filter(c => [14, 2, 3, 4, 5].includes(c.getRank()));
            // Sort to ensure the Ace is at the beginning or end as needed
            straightCards.sort((a, b) => a.getRank() - b.getRank());
            return straightCards;
        }

        return []; // No straight found
    }

    private static isFourOfAKind(cards: Card[]): Card[] {
        const grouped = this.groupByValue(cards);
        for (const [value, group] of grouped) {
            if (group.length === 4) {
                return [...group, ...this.getHighCards(cards.filter(c => c.getValue() !== value))]
            }
        }
        return [];
    }

    private static isFullHouse(cards: Card[]): Card[] {
        const grouped = this.groupByValue(cards);
        let threeOfAKind: Card[] = [];
        let pair: Card[] = [];
        for (const group of grouped.values()) {
            if (group.length === 3 && !threeOfAKind.length) {
                threeOfAKind = group;
            } else if (group.length >= 2 && !pair.length) {
                pair = group.slice(0, 2);
            }
        }

        if (threeOfAKind.length && pair.length) {
            return [...threeOfAKind, ...pair];
        }
        return [];
    }

    private static isThreeOfAKind(cards: Card[]): Card[] {
        const grouped = this.groupByValue(cards);
        for (const [value, group] of grouped) {
            if (group.length === 3) {
                return [...group, ...this.getHighCards(cards.filter(c => c.getValue() !== value))]
            }
        }
        return [];
    }

    private static isTwoPair(cards: Card[]): Card[] {
        const grouped = this.groupByValue(cards);
        const pairs: Card[] = [];
        for (const group of grouped.values()) {
            if (group.length >= 2) {
                pairs.push(...group.slice(0, 2));
                if (pairs.length === 4) {
                    return [...pairs, this.getHighCards(cards.filter(c => !pairs.includes(c)))[0]];
                }
            }
        }
        return [];
    }

    private static isPair(cards: Card[]): Card[] {
        const grouped = this.groupByValue(cards);
        for (const [value, group] of grouped) {
            if (group.length === 2) {
                return [...group, ...this.getHighCards(cards.filter(c => c.getValue() !== value))]
            }
        }
        return [];
    }

    private static groupByValue(cards: Card[]): Map<CardValue, Card[]> {
        return cards.reduce((map, card) => {
            const group = map.get(card.getValue()) || [];
            group.push(card);
            map.set(card.getValue(), group);
            return map;
        }, new Map<CardValue, Card[]>());
    }

    private static groupBySuite(cards: Card[]): Map<CardSuite, Card[]> {
        return cards.reduce((map, card) => {
            const group = map.get(card.getSuite()) || [];
            group.push(card);
            map.set(card.getSuite(), group);
            return map;
        }, new Map<CardSuite, Card[]>());
    }
}
