import { Player } from "../gameLogic/Player";

export type GameState = "Starting" | "Playing" | "Finished";

export type Room = {
    roomId: string,
    numberOfPlayers: number,
    maxPlayers: number,
    gameState: GameState,
    creationTime: number,
    players?: Player[]
}

export class RoomState {
  private static instance: RoomState;
  private rooms: Room[] = [];

  private constructor() {}

  public static getInstance(): RoomState {
    if (!RoomState.instance) {
      RoomState.instance = new RoomState();
    }
    return RoomState.instance;
  }

  public getRooms(): Room[] {
    return this.rooms;
  }

  public addRoom(room: Room): void {
    this.rooms.push(room);
  }

  public removeRoom(roomId: string): void {
    this.rooms = this.rooms.filter(room => room.roomId !== roomId);
  }

  public getRoom(roomId: string): Room | undefined {
    return this.rooms.find(room => room.roomId === roomId);
  }
}
