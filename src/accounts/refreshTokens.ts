import { FastifyRequest } from "fastify"

export const refreshTokens = async (request: FastifyRequest) => {
  try {
  } catch (e) {
    throw new Error(`Error getting user from cookies: ${e}`)
  }
}
