"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomState = void 0;
class RoomState {
    constructor() {
        this.rooms = [];
    }
    static getInstance() {
        if (!RoomState.instance) {
            RoomState.instance = new RoomState();
        }
        return RoomState.instance;
    }
    getRooms() {
        return this.rooms;
    }
    addRoom(room) {
        this.rooms.push(room);
    }
    removeRoom(roomId) {
        this.rooms = this.rooms.filter(room => room.roomId !== roomId);
    }
    getRoom(roomId) {
        return this.rooms.find(room => room.roomId === roomId);
    }
}
exports.RoomState = RoomState;
