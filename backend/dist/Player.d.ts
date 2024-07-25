import { Card } from "./Card";
export declare class Player {
    id: string;
    name: string;
    balance: number;
    addedTime: Date;
    hasFolded: boolean;
    hasChecked: boolean;
    hasDoneAllIn: boolean;
    hand: Card[];
    constructor(name: string, balance: number);
    addCard(card: Card): void;
    fold(): "folded";
    check(): "checked";
    call(amount: number): "called";
    raise(amount: number): "raised";
    allIn(): "all-in";
    smallBlind(): Promise<number>;
    bigBlind(smallBindValue: number): Promise<number>;
    askForAction(currentBet: number): Promise<{
        message: "folded" | "called" | "raised" | "all-in" | "checked" | "bet" | "Invalid action";
        value: number;
    }>;
    askForActionWhenBetSet(currentBet: number): Promise<{
        message: "folded" | "called" | "raised" | "all-in" | "Invalid action";
        value: number;
    }>;
    askForActionWhenNoBetSet(): Promise<{
        message: "checked" | "folded" | "bet" | "Invalid action";
        value: number;
    }>;
}
