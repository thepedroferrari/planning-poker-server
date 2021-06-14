import { LogUserIn } from "../types/types"
import { createSession } from "./createSession"

export const logUserIn = async ({ userId, request, reply }: LogUserIn) => {
  const connection = {
    ip: request.ip,
    userAgent: request.headers["user-agent"],
  }

  // Create Session
  const sessionToken = await createSession({ userId, connection })
  // Create JWT
  console.log(sessionToken)

  // Set Cookie
  if (!reply) return null
}
