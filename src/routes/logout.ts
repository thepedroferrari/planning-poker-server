import { FastifyReply, FastifyRequest } from "fastify"
import { logUserOut } from "../accounts/logUserOut"
import { STATUS } from "../constants"

export const logoutRoute = async (request: FastifyRequest, reply: FastifyReply) => {
  await logUserOut(request, reply)

  reply.send({
    data: {
      status: STATUS.SUCCESS,
      message: "User Logged out",
    },
  })
}
