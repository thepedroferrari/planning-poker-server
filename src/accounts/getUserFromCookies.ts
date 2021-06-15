import { FastifyReply, FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"
import mongodb from "mongodb"
import { Session } from "src/types/types.js"
import { refreshTokens } from "./refreshTokens.js"

const { ObjectId } = mongodb

export const getUserFromCookies = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { user } = await import("../models/user.js")

  try {
    // token exists?
    if (request.cookies?.accessToken) {
      const { accessToken } = request.cookies
      // decode access token
      const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET)

      return user.findOne({
        _id: new ObjectId((decodedAccessToken as { userId: string })?.userId),
      })
    }

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

      // look up session
      const currentSession = (await session.findOne({
        sessionToken,
      })) as Session | undefined

      if (currentSession?.valid) {
        // Look up current User
        const currentUser = await user.findOne({
          _id: new ObjectId(currentSession.userId),
        })

        // refresh tokens
        await refreshTokens({ sessionToken, reply, userId: currentUser._id })

        // return current user
        return currentUser
      }
    }
  } catch (e) {
    throw new Error(`Error getting user from cookies: ${e}`)
  }
}
