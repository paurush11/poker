interface CreateRoomInputs {
    balance: number | undefined
    username: string
    numberOfPlayers: number | undefined
}

interface JoinRoomInputs {
    roomId: string
    username: string
    balance: number | undefined
}
interface validateInputs {
    joinRoom?: JoinRoomInputs
    createRoom?: CreateRoomInputs
    type: "join" | "create"
}

export type {
    validateInputs
}