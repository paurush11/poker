import { Player } from "../gameLogic/Player";
export type GameState = "Starting" | "Playing" | "Finished";
export type Room = {
    roomId: string;
    numberOfPlayers: number;
    maxPlayers: number;
    gameState: GameState;
    creationTime: number;
    players?: Player[];
};
export declare class RoomState {
    private static instance;
    private rooms;
    private constructor();
    static getInstance(): RoomState;
    getRooms(): Room[];
    addRoom(room: Room): void;
    removeRoom(roomId: string): void;
    getRoom(roomId: string): Room | undefined;
}
