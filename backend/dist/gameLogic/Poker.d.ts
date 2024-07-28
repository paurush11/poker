import { Card, gameFormat } from "./Card";
import { Player } from "./Player";
type PokerMoney = 5 | 10 | 15 | 25 | 50 | 100;
type BetMessageWhenBetSet = "raise" | "call" | "fold" | "all-in";
type BetMessageWhenNoBetSet = "check" | "bet";
export declare class Poker {
    private dealer;
    private players;
    private gameFormat;
    private playerBets;
    private playerRankings;
    private currentStake;
    private totalMoneySpent;
    private currentPlayerIndex;
    private communityCards;
    private playerChecked;
    constructor(gameFormat: gameFormat);
    getCommunityCards(): Card[];
    getCards(playerId: string): Card[];
    addAllPlayers(): Promise<void>;
    addPlayerUpdate(player: Player): {
        code: number;
        message: string;
    };
    addPlayer(player: Player): {
        code: number;
        message: string;
    } | undefined;
    sortPlayers(): Player[];
    dealerStartGame(): void;
    start(): Promise<void>;
    displayWinner(): Player;
    startTexasGame(): Promise<void>;
    smallBindUpdate(amount: number): {
        code: number;
        message: string;
    };
    bigBindUpdate(amount: number): {
        code: number;
        message: string;
    };
    updateCurrentPlayerIndex(): void;
    updatePlayerBets(): void;
    updateCheckedStatus(): void;
    checkConsistency(): boolean;
    betUpdateOnNoBetSet(message: BetMessageWhenNoBetSet, money: PokerMoney): {
        code: number;
        message: string;
    };
    betUpdateOnPrevBet(message: BetMessageWhenBetSet, money: PokerMoney): {
        code: number;
        message: string;
        winner?: undefined;
    } | {
        code: number;
        message: string;
        winner: Player;
    };
    callBlinds(): Promise<void>;
    bet(): Promise<true | undefined>;
    dealAtTheTable(preFlop: Boolean): void;
    dealCardsToPlayers(times: number): void;
    preFlop(): void;
    rankPlayers(): void;
    predictWinner(): Player;
    toString(): string;
}
export {};
