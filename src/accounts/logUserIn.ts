import { FastifyReply } from "fastify"
import { LogUserIn } from "../types/types"
import { createSession } from "./createSession"
import { setAuthCookies } from "./setAuthCookies"
import { createTokens } from "./tokens"

export const logUserIn = async ({ userId, request, reply }: LogUserIn) => {
  // Create Connection Data
  const connection = {
    ip: request.ip,
    userAgent: request.headers["user-agent"],
  }

  // Create Session
  const sessionToken = await createSession({ userId, connection })

  // Create JWT
  const { accessToken, refreshToken } = await createTokens(sessionToken, userId)

  // Set Cookie
  setAuthCookies({ reply, accessToken, refreshToken })
}
