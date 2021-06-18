import { FastifyReply, FastifyRequest } from "fastify"
import { getUserFromCookies } from "src/accounts/getUserFromCookies"
import { STATUS } from "../constants"

export const testAccountRoute = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // Verify User login
    const user = await getUserFromCookies(request, reply)
    // Return user email if found, otherwise return false

    reply.type("application/json").code(200)
    user?._id
      ? reply.send({
          data: {
            status: STATUS.SUCCESS,
            user,
          },
        })
      : reply.send({
          data: {
            status: STATUS.FAILURE,
          },
        })
  } catch (e) {
    reply.send({
      data: {
        status: STATUS.FAILURE,
        error: e,
      },
    })
    throw new Error(`Error verifying from cookies: ${e}`)
  }
}
