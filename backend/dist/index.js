"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Poker_1 = require("./Poker");
const main = () => {
    console.log("Welcome to the Poker game!");
    const pokerGame = Poker_1.Poker.createInstance("TexasHoldem");
    pokerGame.start();
};
main();
