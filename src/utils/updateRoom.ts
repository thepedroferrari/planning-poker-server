import { Room } from "../types/types.js"
import mongodb from "mongodb"
const { ObjectId } = mongodb

export const updateRoom = async (currentRoom: Room, updatedRoom: Room) => {
  const { room } = await import("../models/room.js")

  room.replaceOne({ _id: new ObjectId(currentRoom._id) }, updatedRoom)
}
