import { Poker } from "./Poker";

export class PokerState {
    private static instance: PokerState;
    private pokerGames: Map<string, Poker> = new Map();

    private constructor() { }

    public static getInstance(): PokerState {
        if (!PokerState.instance) {
            PokerState.instance = new PokerState();
        }
        return PokerState.instance;
    }

    public getPokerGames(): Map<string, Poker> {
        return this.pokerGames;
    }

    public addPokerGame(roomId: string, pokerGame: Poker): void {
        this.pokerGames.set(roomId, pokerGame);
    }

    public removePokerGame(roomId: string): void {
        this.pokerGames.delete(roomId);
    }

    public getPokerGame(roomId: string): Poker | undefined {
        return this.pokerGames.get(roomId);
    }

    public clearPokerGames(): void {
        this.pokerGames.clear();
    }

    public createPokerGame(roomId: string): Poker {
        const pokerGame = new Poker("TexasHoldem");
        this.addPokerGame(roomId, pokerGame);
        return pokerGame;
    }
}
