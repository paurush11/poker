import { Card } from "./Card";
import { askForBet, askForLargeBlind, askForSmallBlind, currentPlayerBetWhenBetAlreadySet, currentPlayerBetWhenNoBetSet } from "./promptValueSchema";

export class Player {
    id: string;
    name: string;
    balance: number;
    addedTime: Date;
    hasFolded: boolean;
    hasChecked: boolean;
    hasDoneAllIn: boolean;
    hand: Card[];
    constructor(name: string, balance: number) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.balance = balance;
        this.addedTime = new Date();
        this.hasFolded = false;
        this.hasChecked = false;
        this.hand = [];
        this.hasDoneAllIn = false;
    }
    addCard(card: Card) {
        this.hand.push(card);
        if (this.hand.length > 5) {
            throw new Error("Too many cards");
        }
    }
    fold(): "folded" {
        console.log(`${this.name} has folded`);
        this.hasFolded = true;
        return "folded"
    }
    check(): "checked" {
        console.log(`${this.name} has checked`);
        return "checked"
    }
    call(amount: number): "called" {
        console.log(`${this.name} has called`);
        this.balance -= amount;
        return "called"
    }
    raise(amount: number): "raised" {
        console.log(`${this.name} has raised`);
        this.balance -= amount;
        return "raised"
    }
    allIn(): "all-in" {
        console.log(`${this.name} has all in`);
        this.hasDoneAllIn = true;
        return "all-in"
    }
    async smallBlind() {
        console.log(`${this.name} has small blind`);
        const value = await askForSmallBlind();
        return value;
    }
    async bigBlind(smallBindValue: number) {
        console.log(`${this.name} has big blind`);
        const value = await askForLargeBlind(smallBindValue);
        return value;
    }
    async askForAction(currentBet: number): Promise<{
        message: "folded" | "called" | "raised" | "all-in" | "checked" | "bet" | "Invalid action",
        value: number
    }> {
        if (this.hasFolded) {
            return { message: "folded", value: 0 };
        }

        console.log(`${this.name} has asked for action`);
        
        if (currentBet === 0) {
            return this.askForActionWhenNoBetSet();
        } else {
            return this.askForActionWhenBetSet(currentBet);
        }
    }

    async askForActionWhenBetSet(currentBet: number): Promise<{
        message: "folded" | "called" | "raised" | "all-in" | "Invalid action",
        value: number
    }> {
        if (this.hasFolded) {
            return { message: "folded", value: 0 }
        }

        console.log(`${this.name} has asked for action`);
        const action = await currentPlayerBetWhenBetAlreadySet();
        switch (action) {
            case "call":
                return this.balance < currentBet ?
                    { message: "all-in", value: this.balance } :
                    { message: this.call(currentBet), value: currentBet };

            case "raise":
                const raiseValue = await askForBet();
                return this.balance < raiseValue ?
                    { message: "all-in", value: this.balance } :
                    { message: this.raise(raiseValue), value: raiseValue };

            case "fold":
                return { message: this.fold(), value: 0 };
            default:
                return {
                    message: "Invalid action",
                    value: -1
                }
        }
    }
    async askForActionWhenNoBetSet(): Promise<{
        message: "checked" | "folded" | "bet" | "Invalid action",
        value: number
    }> {
        console.log(`${this.name} has asked for action`);
        const action = await currentPlayerBetWhenNoBetSet();
        switch (action) {
            case "check":
                return { message: this.check(), value: 0 };
            case "fold":
                return { message: this.fold(), value: 0 };
            case "bet":
                const betValue = await askForBet();
                return { message: "bet", value: betValue };
            default:
                return { message: "Invalid action", value: -1 };
        }
    }
}
