import { randomBytes } from "crypto"
import { ConnectionInfo, Session } from "../types/types.js"

type CreateSession = {
  userId: string
  connection: ConnectionInfo
}

export const createSession = async ({ userId, connection }: CreateSession) => {
  try {
    // Make a JWT Session token
    const token = randomBytes(12).toString("hex")
    const now = Date.now().toString(16)
    const sessionToken = token + now

    // Get connection Info
    const { ip, userAgent } = connection

    // insert session on DB
    const { session } = await import("../models/session.js")
    const newDate = new Date()

    const newSession: Session = {
      sessionToken,
      userId,
      valid: true,
      ip,
      userAgent,
      updatedAt: newDate,
      createdAt: newDate,
    }

    await session.insertOne(newSession)

    return sessionToken
  } catch (e) {
    throw new Error(`Error at creating session. ${e}`)
  }

  // return session token
}
