import { FastifyReply } from "fastify"
import { setAuthCookies } from "./setAuthCookies"
import { createTokens } from "./tokens"

type RefreshTokens = {
  sessionToken: string
  reply: FastifyReply
  userId: string
}

export const refreshTokens = async ({ sessionToken, reply, userId }: RefreshTokens) => {
  try {
    const { accessToken, refreshToken } = await createTokens(sessionToken, userId)
    setAuthCookies({ reply, accessToken, refreshToken })
  } catch (e) {
    throw new Error(`Error getting user from cookies: ${e}`)
  }
}
