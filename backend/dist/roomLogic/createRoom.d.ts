import { Player } from "../gameLogic/Player";
import { Room } from "./roomstate";
declare const createRoom: (numberOfPlayers: number, player: Player) => Room;
declare const joinRoom: (roomId: string, player: Player) => {
    message?: string;
    error?: string;
};
declare const leaveRoom: (roomId: string, clientId: string) => {
    message?: string;
    error?: string;
};
declare const deleteRoom: (roomId: string) => {
    message?: string;
    error?: string;
};
declare const getRoom: (roomId: string) => Room | undefined;
export { createRoom, joinRoom, leaveRoom, deleteRoom, getRoom };
