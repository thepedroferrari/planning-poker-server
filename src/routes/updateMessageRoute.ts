import { Message, Room, SendMessage } from "../types/types"
import { findRoomByName } from "../utils/findRoomByName"
import { updateRoom } from "../utils/updateRoom"

export const updateMessageRoute = async (connection: any, roomName: string) => {
  try {
    connection.socket.on("message", async (message: string) => {
      const parsedMessage = JSON.parse(message) as Partial<SendMessage>
      const { author, text, vote } = parsedMessage

      if (!author || !text) {
        throw new Error(`Error updating Room: Message is invalid.`)
      }

      const currentRoom = await findRoomByName(roomName)

      if (currentRoom === null) {
        connection.socket.send("Room does not exist.")
      }
      const { messages } = currentRoom
      const newMessage: Message = {
        author,
        date: Date.now(),
        text,
        vote,
      }

      const newMessages: Message[] = [...messages, newMessage]
      const newRoom: Room = { ...currentRoom, messages: newMessages }

      await updateRoom(currentRoom, newRoom)

      const pipeline = [{ $match: { "fullDocument.name": roomName } }]
      const { room } = await import("../models/room.js")

      const changeStream = room.watch(pipeline)

      changeStream.on("change", async () => {
        console.log("Message Sent:", newMessage.text)

        await connection.socket.send(JSON.stringify(newMessages))
      })
    })
  } catch (e) {
    throw new Error(`Error updating Room: ${e}`)
  }
}
