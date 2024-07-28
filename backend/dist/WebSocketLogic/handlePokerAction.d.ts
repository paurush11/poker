import { Poker } from "../gameLogic/Poker";
interface Response {
    status: "success" | "error";
    message: string;
    data?: any;
    error?: string;
    code: number;
}
declare const handlePokerAction: (message: string, pokerGame: Poker) => Response;
export { handlePokerAction };
