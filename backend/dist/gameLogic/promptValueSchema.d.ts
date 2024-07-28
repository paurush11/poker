import prompt from 'prompt';
declare const NoBetSchema: prompt.Schema;
declare const BetSchema: prompt.Schema;
declare const RaiseSchema: prompt.Schema;
declare const askForNoOfPlayers: () => Promise<number>;
declare const askForPlayerDetails: () => Promise<{
    name: string;
    balance: number;
}>;
declare const askForSmallBlind: () => Promise<number>;
declare const askForLargeBlind: (smallBlindNumber: number) => Promise<number>;
declare const askForBet: () => Promise<number>;
declare const currentPlayerBetWhenBetAlreadySet: () => Promise<string>;
declare const currentPlayerBetWhenNoBetSet: () => Promise<string>;
export { NoBetSchema, BetSchema, RaiseSchema, askForLargeBlind, askForSmallBlind, currentPlayerBetWhenBetAlreadySet, currentPlayerBetWhenNoBetSet, askForBet, askForNoOfPlayers, askForPlayerDetails };
