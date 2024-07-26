import { z } from "zod"

const createRoomSchema = z.object({
    username: z.string().min(2).max(50),
    balance: z.number().min(0).max(1000000),
})

const joinRoomSchema = z.object({
    username: z.string().min(2).max(50),
    roomId: z.string().min(2).max(50),
    balance: z.number().min(0).max(1000000),
})

export {
    createRoomSchema,
    joinRoomSchema,
}