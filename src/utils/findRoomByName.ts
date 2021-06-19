import { Room } from "../types/types.js"

export const findRoomByName = async (name: string) => {
  const { room } = await import("../models/room.js")
  return (await room.findOne({ name })) as Room
}
