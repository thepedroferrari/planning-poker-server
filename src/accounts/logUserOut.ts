import { FastifyReply, FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"

export const logUserOut = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // Get refresh token
    if (request.cookies?.refreshToken) {
      const { refreshToken } = request.cookies

      // decode refresh token
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
      )
      const sessionToken = (decodedRefreshToken as { sessionToken: string })
        .sessionToken

      const { session } = await import("../models/session.js")

      // Delete database record for session
      await session.deleteOne({
        sessionToken,
      })
    }
    // Remove cookies
    reply.clearCookie("refreshToken").clearCookie("accessToken")
  } catch (e) {
    throw new Error(`Error logging out: ${e}`)
  }
}
