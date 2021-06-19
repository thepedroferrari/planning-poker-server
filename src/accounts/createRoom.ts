import { InsertOneWriteOpResult } from "mongodb"
import { CreateRoom, Room } from "../types/types"

export const createRoom = async ({ name, owner }: CreateRoom) => {
  try {
    // store in DB
    const { room } = await import("../models/room.js")
    const URIEncodedName = encodeURIComponent(name)

    const url = `https://${process.env.ROOT_DOMAIN}/room/${URIEncodedName}`

    const result: InsertOneWriteOpResult<Room> = await room.insertOne({
      name,
      owner,
      messages: [],
      url,
    })

    // Return room from Database
    return result
  } catch (e) {
    throw new Error(`Error creating user: ${e}`)
  }
}
