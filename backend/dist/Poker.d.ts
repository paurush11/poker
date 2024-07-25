import { gameFormat } from "./Card";
import { Player } from "./Player";
export declare class Poker {
    private static instance;
    static createInstance(gameFormat: gameFormat): Poker;
    private dealer;
    private players;
    private gameFormat;
    private playerBets;
    private playerRankings;
    private currentStake;
    private totalMoneySpent;
    private currentPlayerIndex;
    private communityCards;
    private constructor();
    addAllPlayers(): Promise<void>;
    addPlayer(player: Player): void;
    sortPlayers(): void;
    start(): void;
    startTexasGame(): Promise<void>;
    callBlinds(): Promise<void>;
    bet(): Promise<void>;
    dealAtTheTable(preFlop: Boolean): void;
    dealCardsToPlayers(times: number): void;
    preFlop(): void;
    rankPlayers(): void;
    predictWinner(): Player;
}
