import prompt from 'prompt';
import { gameFormat } from './Card';
import { Poker } from './Poker';
import { Player } from './Player';



const main = () => {
    console.log("Welcome to the Poker game!");

    const pokerGame = Poker.createInstance("TexasHoldem" as gameFormat);
    pokerGame.start();



}

main();