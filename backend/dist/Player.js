"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const promptValueSchema_1 = require("./promptValueSchema");
class Player {
    constructor(name, balance) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.balance = balance;
        this.addedTime = new Date();
        this.hasFolded = false;
        this.hasChecked = false;
        this.hand = [];
        this.hasDoneAllIn = false;
    }
    addCard(card) {
        this.hand.push(card);
        if (this.hand.length > 5) {
            throw new Error("Too many cards");
        }
    }
    fold() {
        console.log(`${this.name} has folded`);
        this.hasFolded = true;
        return "folded";
    }
    check() {
        console.log(`${this.name} has checked`);
        return "checked";
    }
    call(amount) {
        console.log(`${this.name} has called`);
        this.balance -= amount;
        return "called";
    }
    raise(amount) {
        console.log(`${this.name} has raised`);
        this.balance -= amount;
        return "raised";
    }
    allIn() {
        console.log(`${this.name} has all in`);
        this.hasDoneAllIn = true;
        return "all-in";
    }
    smallBlind() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`${this.name} has small blind`);
            const value = yield (0, promptValueSchema_1.askForSmallBlind)();
            return value;
        });
    }
    bigBlind(smallBindValue) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`${this.name} has big blind`);
            const value = yield (0, promptValueSchema_1.askForLargeBlind)(smallBindValue);
            return value;
        });
    }
    askForAction(currentBet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasFolded) {
                return { message: "folded", value: 0 };
            }
            console.log(`${this.name} has asked for action`);
            if (currentBet === 0) {
                return this.askForActionWhenNoBetSet();
            }
            else {
                return this.askForActionWhenBetSet(currentBet);
            }
        });
    }
    askForActionWhenBetSet(currentBet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasFolded) {
                return { message: "folded", value: 0 };
            }
            console.log(`${this.name} has asked for action`);
            const action = yield (0, promptValueSchema_1.currentPlayerBetWhenBetAlreadySet)();
            switch (action) {
                case "call":
                    return this.balance < currentBet ?
                        { message: "all-in", value: this.balance } :
                        { message: this.call(currentBet), value: currentBet };
                case "raise":
                    const raiseValue = yield (0, promptValueSchema_1.askForBet)();
                    return this.balance < raiseValue ?
                        { message: "all-in", value: this.balance } :
                        { message: this.raise(raiseValue), value: raiseValue };
                case "fold":
                    return { message: this.fold(), value: 0 };
                default:
                    return {
                        message: "Invalid action",
                        value: -1
                    };
            }
        });
    }
    askForActionWhenNoBetSet() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`${this.name} has asked for action`);
            const action = yield (0, promptValueSchema_1.currentPlayerBetWhenNoBetSet)();
            switch (action) {
                case "check":
                    return { message: this.check(), value: 0 };
                case "fold":
                    return { message: this.fold(), value: 0 };
                case "bet":
                    const betValue = yield (0, promptValueSchema_1.askForBet)();
                    return { message: "bet", value: betValue };
                default:
                    return { message: "Invalid action", value: -1 };
            }
        });
    }
}
exports.Player = Player;
