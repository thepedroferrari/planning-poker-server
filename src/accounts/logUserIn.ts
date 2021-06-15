import { LogUserIn } from "../types/types"
import { createSession } from "./createSession"
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
  const now = new Date()
  const refreshExpires = new Date(now.setDate(now.getDate() + 30))

  // Send cookies back to Frontend
  reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      expires: refreshExpires,
    })
    .setCookie("accessToken", accessToken, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
    })
}
