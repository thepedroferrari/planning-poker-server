import { FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"
import mongodb from "mongodb"
const { ObjectId } = mongodb

export const getUserFromCookies = async (request: FastifyRequest) => {
  try {
    // token exists?
    if (request.cookies?.accessToken) {
      const { accessToken } = request.cookies
      // decode access token
      const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET)
      const { user } = await import("../models/user.js")

      return user.findOne({
        _id: new ObjectId((decodedAccessToken as { userId: string })?.userId),
      })
    }

    // return user from record
    // decode refresh token
    // look up session
    // confirm session is valid
    // if session is valid:
    // Look up current User
    // refresh tokens
    // return current user
  } catch (e) {
    throw new Error(`Error getting user from cookies: ${e}`)
  }
}
