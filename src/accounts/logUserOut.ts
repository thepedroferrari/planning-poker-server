import { FastifyReply, FastifyRequest } from "fastify"
import { CookieSerializeOptions } from "fastify-cookie"
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
    const cookieOptions: CookieSerializeOptions = {
      domain: process.env.ROOT_DOMAIN,
      path: "/",
    }
    reply
      .clearCookie("refreshToken", cookieOptions)
      .clearCookie("accessToken", cookieOptions)
  } catch (e) {
    throw new Error(`Error logging out: ${e}`)
  }
}
